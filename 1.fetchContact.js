fn(state => {
  const today = new Date();
  const potentialStartDate = [];

  const setDays = (date, x) => {
    return new Date(new Date(date).setDate(date.getDate() + x))
      .toISOString()
      .split('T')[0];
  };

  potentialStartDate.push(
    setDays(today, -180),
    setDays(today, -360),
    setDays(today, -540)
  );
  return query(
    `SELECT Id, CommCare_Case_ID__c FROM Contact WHERE SMS_Treatment__c = 'Bracing Night' AND
    SMS_Treatment_Start_Date__c in (${potentialStartDate.join(',')}')`
  )(state).then(state => {
    const { records } = state.references[0];

    const contacts = records.map(record => {
      return {
        id: record.Id,
        caseId: record.CommCare_Case_ID__c,
      };
    });

    return { ...state, contacts };
  });
});
