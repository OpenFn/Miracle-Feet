fn(state => {
  const today = new Date();
  const potentialStartDate = [];

  const setDays = (date, x) => {
    return new Date(new Date(date).setDate(date.getDate() + x))
      .toISOString()
      .split('T')[0];
  };

  potentialStartDate.push(
    setDays(today, -90),
    setDays(today, -180),
    setDays(today, -270),
    setDays(today, -360),
    setDays(today, -450),
    setDays(today, -540),
    setDays(today, -630),
    setDays(today, -720),
    setDays(today, -810),
    setDays(today, -900),
    setDays(today, -990),
    setDays(today, -1080),
    setDays(today, -1170),
    setDays(today, -1260),
    setDays(today, -1350)
  );
  return query(
    `SELECT Name, SMS_Treatment_Start_Date__c, Guardian_1_First_Name__c, Pronoun_he_she__c, Pronoun_him_her__c, Pronoun_his_her__c, Clinic_Country__c, Guardian_1_Phone_Number_1__c, CommCare_Case_ID__c 
    FROM Contact WHERE SMS_Treatment__c = 'Bracing Night' AND Send_SMS__c = true AND SMS_Opt_In_II__c = true AND SMS_Treatment_Start_Date__c in (${potentialStartDate.join(
      ','
    )})`
  )(state).then(state => {
    const { records } = state.references[0];

    const contacts = records.map(record => {
      return {
        id: record.Id,
        caseId: record.CommCare_Case_ID__c,
        startDate: record.SMS_Treatment_Start_Date__c,
        Name: record.Name,
        Country: record.Clinic_Country__c,
        Phone: record.Guardian_1_Phone_Number_1__c,
        pronoun_his_her: record.Pronoun_his_her__c,
        pronoun_he_she: record.Pronoun_he_she__c,
        pronoun_him_her: record.Pronoun_him_her__c,
        guardian1_first_name: record.Guardian_1_First_Name__c,
      };
    });
    return { ...state, contacts };
  });
});
