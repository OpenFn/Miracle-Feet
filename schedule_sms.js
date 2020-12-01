alterState(state => {
  const treatmentMap = {
    casting: 'casting_intro',
    tenotomy: 'tenotomy',
    bracing_day: 'bracing_day',
    bracing_night: 'bracing_night',
    complet: 'treatment_complete',
    suspended: 'treatment_suspensed',
  };

  const { form } = state.data;
  const { calcs } = form;
  const { sms_opt_in, send_sms } = calcs.sms;

  let bulkId = [];
  let activeConditions = [];
  if (sms_opt_in === 'yes' && send_sms === 'on') {
    const { treatment } = calcs.sms;
    if (treatment === '') {
      bulkId.push({ patientReg: 'register-' });
      bulkId.push({ treatmentReg: 'treatment-' });
      activeConditions.push('patientReg', 'treatmentReg');
    } else {
      //bulkId = `${treatmentMap[treatment]}-${form.case['@case_id']}`;
      bulkId.push(`${treatmentMap[treatment]}-${form.case['@case_id']}`);
      activeConditions.push('patientReg', 'treatmentReg');
    }
  }

  // Once upon a time, there was this place where magic happens...
  function buildMapping() {
    const staticObject = {
      patientReg: [
        {
          EN: [
            'Hi',
            'guardian1_first_name',
            'This is from the clubfoot clinic at',
            'clinic_name',
            'We will send you important information and reminders regarding',
            'patient_first_name',
            "'s treatment.",
          ],
          FR: [
            'Bonjour',
            'guardian1_first_name',
            "c'est la clinique du pied bot. Nous vous enverrons des informations importantes et des rappels concernant le traitement de",
            'patient_first_name',
          ],
          relativeDay: 0,
        },
      ],
      treatmentReg: [
        {
          EN: [
            'Hi',
            'guardian1_first_name',
            'Clubfoot is a medical condition that happens to 1 out of 800 babies. No one is to blame for clubfoot. It can affect anyone!',
          ],
          FR: [
            'Bonjour',
            'guardian1_first_name',
            "Le pied bot est un trouble médical qui touche 1 bébé sur 800. Personne n'est à blâmer concernant le pied bot. Cela peut affecter n'importe qui!",
          ],
          relativeDay: 0,
          clockTime: '09:00:00',
          date: 'registration_date',
        },
        {
          EN: [
            'Almost all children that complete the Ponseti plaster casting method grow up walking normally, with no pain. It is the best treatment for your baby!',
          ],
          FR: [
            "Presque tous les enfants qui complètent la méthode de moulage en plâtre de Ponseti grandissent normalement, sans douleur. C'est le meilleur traitement pour votre bébé!",
          ],
          relativeDay: 0,
          clockTime: '09:05:00',
          date: 'registration_date',
        },
        {
          EN: [
            'Hi',
            'guardian1_first_name',
            'You are not alone in the clubfoot treatment process. Reach out to other parents at the clinic or to your doctor for support!',
          ],
          FR: [
            'Bonjour',
            'guardian1_first_name',
            "Vous n'êtes pas seul dans le processus de traitement du pied bot. Communiquez avec d'autres parents à la clinique ou avec votre médecin pour obtenir des informations et de l'aide!",
          ],
          relativeDay: 1,
          clockTime: '09:00:00',
          date: 'registration_date',
        },
      ],
    };
    return staticObject;
  }

  return { ...state, bulkId, activeConditions, buildMapping };
});

alterState(state => {
  const { host, token } = state.configuration;

  function getSMS(bulkId) {
    return get(
      `${host}/1/bulks?bulkId=${bulkId}`,
      {
        header: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
          options: {
            customCodes: [404],
          },
        },
      },
      state => {
        return state.data;
      }
    )(state);
  }

  function scheduleSMS(bulkId, messages) {
    post(
      `${host}/2/text/advanced`,
      {
        header: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: {
          bulkId,
          messages,
        },
      },
      state => {
        console.log(state.data);
      }
    )(state);
  }

  function rescheduleSMS(bulkId, sendAt) {
    put(
      `${host}/1/bulks?bulkId=${bulkId}`,
      {
        header: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: {
          sendAt,
        },
      },
      state => {
        console.log(state.data.body);
      }
    )(state);
  }

  function sendSMS(bulkId, messages) {
    //console.log('bulkId', bulkId);
    getSMS(bulkId).then(res => {
      const { form } = state.data;
      const { calcs } = form;
      const { next_visit_date } = calcs.general;
      if (res.requestError) {
        console.log(`Scheduling SMS for ${next_visit_date}...`);

        //scheduleSMS(bulkId, messages);
      } else {
        console.log(
          `SMS already scheduled for ${next_visit_date}. Rescheduling...`
        );
        //rescheduleSMS(bulkId, next_visit_date);
      }
    });
  }
  const { form } = state.data;
  const { calcs } = form;

  const maps = state.buildMapping();
  const language_code = calcs.sms.language_code || 'EN';

  for (var i = 0; i < state.activeConditions.length; i++) {
    const test = maps[state.activeConditions[i]].map((mapping, nb) => {
      const date =
        dataValue(`form.case.update.${mapping.date}`)(state) || Date.now();

      let sendAtDate = new Date(date);

      // We build the bulkId from the case-type, the number of sms and the case id
      const bulkId = `${state.bulkId[i][state.activeConditions[i]]}${nb + 1}-${
        form.case['@case_id']
      }`;

      const sms = mapping[language_code]
        .map((item, pos) =>
          pos % 2 === 0 ? item : dataValue(`form.case.update.${item}`)(state)
        )
        .join(' ');
      //bulkId.push(`register-${form.case['@case_id']}`);

      sendAtDate.setDate(sendAtDate.getDate() + mapping.relativeDay);
      const hours = mapping.clockTime
        ? mapping.clockTime.split(':')[0]
        : new Date().getHours();
      const minutes = mapping.clockTime
        ? mapping.clockTime.split(':')[1]
        : new Date().getMinutes();
      const seconds = mapping.clockTime
        ? mapping.clockTime.split(':')[2]
        : new Date().getSeconds();

      sendAtDate.setHours(parseInt(hours));
      sendAtDate.setMinutes(parseInt(minutes));
      sendAtDate.setSeconds(parseInt(seconds));

      const sendAt = sendAtDate.toISOString();
      console.log('Sending this sms at ', sendAtDate.toISOString());
      const messages = [
        {
          from: '+221771791380',
          destinations: [
            {
              to: '+221771791380',
            },
          ],
          text: sms,
          sendAt,
        },
      ];

      // Check output for details
      console.log(messages);

      sendSMS(bulkId, messages);
      /* console.log(
        mapping[language_code]
          .map((item, pos) =>
            pos % 2 === 0 ? item : dataValue(`form.case.update.${item}`)(state)
          )
          .join(' ')
      ); */
      //console.log(mapping[language_code].join(''));
      return mapping[language_code]
        .map((item, pos) =>
          pos % 2 === 0 ? item : dataValue(`form.case.update.${item}`)(state)
        )
        .join(' ');
    });
    //console.log(test);
  }

  return state;
});
