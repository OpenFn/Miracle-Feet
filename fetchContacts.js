fn(state => {
  // Here we have a complex fetch query that should return:
  // 1. info on patients and guardian (Name, guardian_1_First_Name__c, ...)
  // 2. info on scheduling dates
  // 3. info on sms opt-in details
  // 4. info on treatment details
  // 5. depending on a specific list of account's status
  return query(
    `SELECT Name, Account.Status__c, Guardian_1_First_Name__c, Pronoun_he_she__c, Pronoun_him_her__c, Pronoun_his_her__c, Clinic_Country__c, Guardian_1_Phone_Number_1__c, CommCare_Case_ID__c, 
    SMS_Treatment_Start_Date__c, Next_Visit_Date__c, Registration_Date__c, Date_of_First_Visit__c, Last_Visit_Date__c, Last_Modified_Date_CommCare__c
    SMS_Opt_In_II__c, SMS_Opt_In__c, Send_SMS__c,
    SMS_Treatment__c, SMS_Original_Treatment__c, Reason_Stopped_Treatment__c, Brace_Problems_Type__c
      FROM Contact`
  )(state).then(state => {
    const { records } = state.references[0];

    const contacts = records.map(record => {
      return {
        id: record.Id,
        Name: record.Name,
        guardian1_first_name: record.Guardian_1_First_Name__c,
        status: record.Account.Status__c,
        pronoun_he_she: record.Pronoun_he_she__c,
        pronoun_him_her: record.Pronoun_him_her__c,
        pronoun_his_her: record.Pronoun_his_her__c,
        Country: record.Clinic_Country__c,
        Phone: record.Guardian_1_Phone_Number_1__c,
        caseId: record.CommCare_Case_ID__c,

        startDate: record.SMS_Treatment_Start_Date__c,
        nextVisitDate: record.Next_Visit_Date__c,
        registrationDate: record.Registration_Date__c,
        firstVisitDate: record.Date_of_First_Visit__c,
        lastVisitDate: record.Last_Visit_Date__c,
        lastModifiedDateCommCare: record.Last_Modified_Date_CommCare__c,

        smsOptIn: record.SMS_Opt_In__c,
        smsOptInII: record.SMS_Opt_In_II__c,

        treatment: record.SMS_Treatment__c,
        originalTreatment: record.SMS_Original_Treatment__c,
        reasonStoppedTreatment: record.Reason_Stopped_Treatment__c,
        braceProblemType: record.Brace_Problems_Type__c,

        sendSms: record.Send_SMS__c,
      };
    });
    return { ...state, contacts };
  });
});