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
    setDays(today, -540),
    setDays(today, -720),
    setDays(today, -900),
    setDays(today, -1080),
    setDays(today, -1260)
  );
  return query(
    `SELECT Name, Clinic_Country__c, Guardian_1_Phone_Number_1__c, CommCare_Case_ID__c FROM Contact WHERE SMS_Treatment__c = 'Bracing Night' AND SMS_Treatment_Start_Date__c in (${potentialStartDate.join(
      ','
    )})`
  )(state).then(state => {
    const { records } = state.references[0];

    const contacts = records.map(record => {
      return {
        id: record.Id,
        caseId: record.CommCare_Case_ID__c,
        Name: record.Name,
        Country: record.Clinic_Country__c,
        Phone: record.Guardian_1_Phone_Number_1__c,
      };
    });

    return { ...state, contacts };
  });
});