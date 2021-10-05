fn(state => {
  // prettier-ignore
  const bulkIdsPrefixes = ['registration-1-','registration-2-','registration-3-','registration-4-','casting_intro-1-','casting_intro-2-','casting_intro-3-','casting_intro-4-','casting_intro-5-','casting_intro-6-','casting_intro-7-','casting_intro-8-','casting_intro-9-','casting_intro-10-','casting_intro-11-','casting_intro-12-','casting_intro-13-','casting_intro-14-','casting_intro-15-','casting_intro-16-','casting_intro-17-','tenotomy-','bracing_intro-1-','bracing_intro-2-','bracing_intro-3-','bracing_day-1-','bracing_day-2-','bracing_day-3-','bracing_day-4-','bracing_day-5-','bracing_day-6-','bracing_day-7-','bracing_day-8-','bracing_day-9-','bracing_day-10-','bracing_day-11-','bracing_day-12-','bracing_day-13-','bracing_day-14-','bracing_day-15-','bracing_day-16-','bracing_day-17-','bracing_day-18-','bracing_day-19-','bracing_day-20-','bracing_day-21-','bracing_night-','bracing_night_campaign-2-','bracing_night_campaign-3-','bracing_night_campaign-4-','bracing_night_campaign-5-','bracing_night_campaign-6-','bracing_night_campaign-7-','bracing_night_campaign-8-','bracing_night_campaign-9-','bracing_night_campaign-10-','bracing_night_campaign-11-','bracing_night_campaign-12-','bracing_night_campaign-13-','bracing_night_campaign-14-','bracing_night_campaign-15-','bracing_night_campaign-16-','bracing_night_campaign-17-','bracing_night_campaign-18-','bracing_night_campaign-19-','bracing_night_campaign-20-','bracing_night_campaign-21-','bracing_night_campaign-22-','bracing_night_campaign-23-','bracing_night_campaign-24-','bracing_night_campaign-25-','bracing_night_campaign-26-','bracing_night_campaign-27-','bracing_night_campaign-28-','bracing_night_campaign-29-','bracing_night_campaign-30-','bracing_night_campaign-31-','bracing_night_campaign-32-','bracing_night_campaign-33-','bracing_night_campaign-34-','bracing_night_campaign-35-','bracing_night_campaign-36-','bracing_night_campaign-37-','bracing_night_campaign-38-','bracing_night_campaign-39-','bracing_night_campaign-40-','bracing_night_campaign-41-','bracing_night_campaign-42-','bracing_night_campaign-43-','bracing_night_campaign-44-','bracing_night_campaign-45-','bracing_night_campaign-46-','bracing_night_campaign-47-','bracing_night_campaign-48-','bracing_night_campaign-49-','bracing_night_campaign-50-','bracing_night_campaign-51-','bracing_night_campaign-52-','bracing_night_campaign-53-','bracing_night_campaign-54-','bracing_night_campaign-55-','bracing_night_campaign-56-','bracing_night_campaign-57-','bracing_night_campaign-58-','bracing_night_campaign-59-','treatment_complete-','not_wearing_brace-','not_tolerating_brace-1-','not_tolerating_brace-2-','not_accepting_brace-','visitBefore-','visitAfter1-','visitAfter2-','treatment_suspended-'];
  const alert1718Prefixes = ['visitBefore-', 'visitAfter1-', 'visitAfter2-'];

  const buildBulkIds = (Ids, prefixes) => {
    const bulkIds = [];
    Ids.forEach(id => {
      prefixes.forEach(prefix => {
        let bulk = [id.CommCare_Case_ID__c, id.Next_Visit_Date__c]
          .filter(Boolean)
          .join('-');
        bulkIds.push(`${prefix}${bulk}`);
      });
    });
    return bulkIds;
  };

  return { ...state, bulkIdsPrefixes, alert1718Prefixes, buildBulkIds };
});

fn(async state => {
  const {
    previouslySupportedCaseIds,
    temporarilySuspendedCaseIds,
    bulkIdsPrefixes,
    alert1718Prefixes,
    configuration,
  } = state;
  const { host, token } = configuration;

  function getSMS(bulkId) {
    return get(
      `${host}/1/bulks/status?bulkId=${bulkId}`,
      {
        header: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        options: {
          successCodes: [200, 404],
        },
      },
      state => {
        const response = state.data;
        if (
          response.bulkId ||
          (response.requestError &&
            response.requestError.serviceException &&
            response.requestError.serviceException.messageId === 'NOT_FOUND')
        ) {
          return response;
        }
        return new Error(response);
      }
    )(state);
  }

  function deleteSMS(bulkId) {
    return put(`${host}/1/bulks/status?bulkId=${bulkId}`, {
      header: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
      body: {
        status: 'CANCELED',
      },
    })(state);
  }

  // Flow 1: Disable SMS for accounts with status 'Previously Supported'
  for (let alert of state.buildBulkIds(
    previouslySupportedCaseIds,
    bulkIdsPrefixes
  )) {
    await getSMS(alert).then(res => {
      if (res.requestError) {
        console.log(`Existing SMS not found for bulkId ${alert}`);
        return state;
      } else {
        if (res.status === 'FINISHED' || res.status === 'CANCELED') {
          console.log(
            'SMS is already canceled or sent, impossible to reschedule!'
          );
          return state;
        }
        return deleteSMS(alert).then(() => {
          console.log(`SMS disabled for bulkId : ${alert}.`);
        });
      }
    });
  }

  // Flow 2: Disable SMS for accounts with status 'Temporarily Suspended'
  for (let alert of state.buildBulkIds(
    temporarilySuspendedCaseIds,
    bulkIdsPrefixes
  )) {
    await getSMS(alert).then(res => {
      if (res.requestError) {
        console.log(`Existing SMS not found for bulkId ${alert}`);
        return state;
      } else {
        if (res.status === 'FINISHED' || res.status === 'CANCELED') {
          console.log(
            'SMS is already canceled or sent, impossible to reschedule!'
          );
          return state;
        }
        return deleteSMS(alert).then(() => {
          console.log(`SMS disabled for bulkId : ${alert}.`);
        });
      }
    });
  }

  return state;
});