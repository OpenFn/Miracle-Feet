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
  let bulkId = '';

  if (sms_opt_in === 'yes' && send_sms === 'on') {
    const { treatment } = calcs.sms;
    if (treatment === '') {
      bulkId = `test-${form.case['@case_id']}`;
    } else {
      bulkId = `${treatmentMap[treatment]}-${form.case['@case_id']}`;
    }
  }
  return { ...state, bulkId };
});
/* 
alterState(state => {
  const { host } = state.configuration;
  return get(
    `${host}/1/bulks`,
    {
      header: {
        'Content-Type': 'application/json',
        Authorization: 'Basic YWxla3NhQG9wZW5mbi5vcmc6bjN3dWZqIWpuUA==',
      },
      body: { bulkId: state.bulkId },
    },
    state => {
      console.log(state);
    }
  )(state);
}); */

alterState(state => {
  const { host } = state.configuration;

  const message = [
    {
      from: '+221771791380',
      destinations: [
        {
          to: '+221771791380',
        },
      ],
      text: 'A long time ago, in a galaxy far, far away...',
      sendAt: '2020-11-24T18:20:00.000',
    },
  ];

  function sendSMS(bulkId, messages) {
    post(
      `${host}/1/text/advanced`,
      {
        header: {
          'Content-Type': 'application/json',
          Authorization: 'Basic YWxla3NhQG9wZW5mbi5vcmc6bjN3dWZqIWpuUA==',
        },
        body: {
          bulkId,
          messages,
        },
      },
      state => {
        console.log(state);
      }
    )(state);
  }

  function rescheduleSMS(bulkId, sendAt) {
    put(
      `${host}/1/text/bulks/?bulkId=${bulkId}`,
      {
        header: {
          'Content-Type': 'application/json',
          Authorization: 'Basic YWxla3NhQG9wZW5mbi5vcmc6bjN3dWZqIWpuUA==',
        },
        body: {
          sendAt,
        },
      },
      state => {
        console.log(state);
      }
    )(state);
  }

  sendSMS(state.bulkId, message);

  return state;
});

//Then we compile request to send to Infobip API
/* post('https://infobip.com/api/sms/', {
  query: {
    api_token: 'KxnJo3KWIs01akwsIq8jRFhs8CKkPffG56nIl0d5QAG2EUcg5Ndjdahdhaha',
  },
  headers: {
    'Content-Type': 'application/json',
  },
  body: state => {},
});
 */
