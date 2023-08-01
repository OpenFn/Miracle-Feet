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
    `SELECT Name, Patient_Name__c, SMS_Treatment_Start_Date__c, Guardian_1_First_Name__c, Pronoun_he_she__c, Pronoun_him_her__c, Pronoun_his_her__c, Clinic_Country__c, Guardian_1_Phone_Number_1__c, CommCare_Case_ID__c, SMS_Error__c 
    FROM Contact WHERE SMS_Treatment__c = 'Bracing Night' AND Send_SMS__c = true AND SMS_Opt_In_II__c = true AND SMS_Treatment_Start_Date__c in (${potentialStartDate.join(
      ','
    )}) AND Account.Status__c in ('Actively Supported', 'Temporarily Suspended') AND Account.Country__c in ('Nigeria', 'Uganda') AND SMS_Error__c = null`
  )(state).then(state => {
    const { records } = state.references[0];

    const contacts = records.map(record => {
      //Transformation to take first substring of patient name (e.g., "Jane Doe" ==> "Jane")
      const patientName = record.Patient_Name__c;
      const firstName =
        patientName && patientName !== ''
          ? patientName.split(' ')[0]
          : undefined;

      return {
        id: record.Id,
        caseId: record.CommCare_Case_ID__c,
        startDate: record.SMS_Treatment_Start_Date__c,
        Name: firstName,
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
fn(async state => {
  const { configuration, contacts } = state;

  const loop = Math.ceil(contacts.length / 30);

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
    const batch = state.contacts.slice(i * 30, (i + 1) * 30);

    const data = {
      tag: 'bracing_night_salesforce',
      contacts: batch,
    };
    await postToInbox(data);
  }

  return { ...state, references: [], data: {} };
});
