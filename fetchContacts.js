fn(state => {
  const setDays = (date, x) => {
    return new Date(new Date(date).setDate(date.getDate() + x))
      .toISOString()
      .split('T')[0];
  };

  // Here we have a complex fetch query that should return:
  // 1. info on patients and guardian (Name, guardian_1_First_Name__c, ...)
  // 2. info on scheduling dates
  // 3. info on sms opt-in details
  // 4. info on treatment details
  // 5. depending on a specific list of account's status
  return query(
    `SELECT Name, Patient_Name__c, Account.Status__c, Account.Country__c, Account.Name, Guardian_1_First_Name__c, Pronoun_he_she__c, Pronoun_him_her__c, Pronoun_his_her__c, Clinic_Country__c, Guardian_1_Phone_Number_1__c, Guardian_1_Phone_Landline__c, CommCare_Case_ID__c, 
    SMS_Treatment_Start_Date__c, Next_Visit_Date_New__c, Registration_Date__c, Date_of_First_Visit__c, Last_Visit_Date__c, Original_Next_Visit_Date__c, Last_Modified_Date_CommCare__c,
    SMS_Opt_In_II__c, SMS_Opt_In__c, Send_SMS__c, SMS_Error__c,
    SMS_Treatment__c, SMS_Original_Treatment__c, Treatment_Completed__c, Reason_Stopped_Treatment__c, Brace_Problems_Type__c, SMS_Language__c, SMS_Timezone__c, Date_of_SMS_Registration__c, Date_Completed_Treatment__c
      FROM Contact
       WHERE Last_Modified_Date_CommCare__c = 
      ${setDays(new Date(), -1)}  
      AND Account.Country__c in ('Nigeria', 'Uganda') AND Account.Status__c in ('Actively Supported', 'Temporarily Suspended')`
      
     
    // WHERE LastModifiedDate > ${new Date(
    //    setDays(new Date(), -1)
    //  ).toISOString()}`
  )(state).then(state => {
    const { records } = state.references[0];

    const contacts = records.map(record => {
        //Transformation to take first substring of patient name (e.g., "Jane Doe" ==> "Jane")
      const patientName = record.Patient_Name__c;
      const firstName =
        patientName && patientName !== ''
          ? patientName.split(' ')[0]
          : undefined;

      //Here we assign SF values to variables to reference in the Infobip scheduling job
      return {
        id: record.Id,
        AccountId: record.Account.Name,
        FirstName: firstName,
        Guardian_1_First_Name__c: record.Guardian_1_First_Name__c,
        status: record.Account.Status__c,
        patientCountry: record.Account.Country__c,
        Pronoun_he_she__c: record.Pronoun_he_she__c,
        Pronoun_him_her__c: record.Pronoun_him_her__c,
        Pronoun_his_her__c: record.Pronoun_his_her__c,
        Country: record.Clinic_Country__c,
        Phone: record.Guardian_1_Phone_Number_1__c,
        GuardianPhoneLandline: record.Guardian_1_Phone_Landline__c,
        caseId: record.CommCare_Case_ID__c,
        sms_language: record.SMS_Language__c,
        sms_timezone: record.SMS_Timezone__c,

        startDate: record.SMS_Treatment_Start_Date__c,
        Next_Visit_Date_New__c: record.Next_Visit_Date_New__c,
        registrationDate: record.Registration_Date__c,
        firstVisitDate: record.Date_of_First_Visit__c,
        lastVisitDate: record.Last_Visit_Date__c,
        originalNextVisitDate: record.Original_Next_Visit_Date__c,
        lastModifiedDateCommCare: record.Last_Modified_Date_CommCare__c,
        smsRegistrationDate: record.Date_of_SMS_Registration__c,
        treatmentCompletedDate: record.Date_Completed_Treatment__c,

        smsOptIn: record.SMS_Opt_In__c,
        smsOptInII: record.SMS_Opt_In_II__c,
        sms_error: record.SMS_Error__c,

        treatment: record.SMS_Treatment__c,
        originalTreatment: record.SMS_Original_Treatment__c,
        treatmentCompleted: record.Treatment_Completed__c,
        reasonStoppedTreatment: record.Reason_Stopped_Treatment__c,
        braceProblemType: record.Brace_Problems_Type__c,

        sendSms: record.Send_SMS__c,
      };
    });
    return { ...state, contacts };
  });
});

fn(async state => {
  const { configuration, contacts } = state;
  
  const batchSize = 15;

  const loop = Math.ceil(contacts.length / batchSize);

  let countInbox = 0;

  const postToInbox = async data => {
    countInbox++;

    console.log(`Sending batch ${countInbox} to inbox`);
    await http.post({
      url: configuration.openfnInboxUrl,
      data: data,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      auth: {username: configuration.openfnUsername, password: configuration.openfnPassword}

    })(state);
  };

  console.log(`Sending ${loop} batches of contacts to inbox`);
  for (let i = 0; i < loop; i++) {
    const batch = state.contacts.slice(i * batchSize, (i + 1) * batchSize);

    const data = {
      tag: 'sms_salesforce',
      contacts: batch,
    };
    await postToInbox(data);
  }

  return { ...state, references: [], data: {} };
});
