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
      bulkId.push(`register-${form.case['@case_id']}`);
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
          delay: 0,
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
          delay: 0,
          date: 'registration_date',
        },
        {
          EN: [
            'Almost all children that complete the Ponseti plaster casting method grow up walking normally, with no pain. It is the best treatment for your baby!',
          ],
          FR: [
            "Presque tous les enfants qui complètent la méthode de moulage en plâtre de Ponseti grandissent normalement, sans douleur. C'est le meilleur traitement pour votre bébé!",
          ],
          delay: 300,
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
          delay: 86400,
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

  const { form } = state.data;
  const {
    guardian1_first_name,
    clinic_name,
    patient_first_name,
  } = form.case.update;
  const { calcs } = form;

  const maps = state.buildMapping();
  const language_code = calcs.sms.language_code || 'EN';

  for (var i = 0; i < state.activeConditions.length; i++) {
    const test = maps[state.activeConditions[i]].map(mapping => {
      const date = dataValue(`form.case.update.${mapping.date}`)(state);
      console
      console.log('Sending this sms at ', Date(date));
      console.log(
        mapping[language_code]
          .map((item, pos) =>
            pos % 2 === 0 ? item : dataValue(`form.case.update.${item}`)(state)
          )
          .join(' ')
      );
      //console.log(mapping[language_code].join(''));
      return mapping[language_code]
        .map((item, pos) =>
          pos % 2 === 0 ? item : dataValue(`form.case.update.${item}`)(state)
        )
        .join(' ');
    });
    console.log(test);
  }

  /* 
  getSMS(state.bulkId).then(res => {
    const { form } = state.data;
    const { calcs } = form;
    const { next_visit_date } = calcs.general;
    if (res.requestError) {
      console.log(`Scheduling SMS for ${next_visit_date}...`);

      // Live Data
      const {
        guardian1_first_name,
        clinic_name,
        patient_first_name,
      } = form.case.update;

      // Building mapping from live data
      const mapping = buildMapping(
        guardian1_first_name,
        clinic_name,
        patient_first_name
      );

      const language_code = calcs.sms.language_code || 'EN';

      const text = mapping.patientReg.map(msg =>
        msg[language_code].join('')
      )[0];

      const messages = [
        {
          from: '+221771791380',
          destinations: [
            {
              to: '+221771791380',
            },
          ],
          text,
          sendAt: next_visit_date,
        },
      ];

      console.log(messages);
      scheduleSMS(state.bulkId, messages);
    } else {
      console.log(
        `SMS already scheduled for ${next_visit_date}. Rescheduling...`
      );
      rescheduleSMS(state.bulkId, next_visit_date);
    }
  });
 */
  return state;
});
