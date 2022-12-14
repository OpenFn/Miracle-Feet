query(
  `Select Id, Account.Name, Account.Status__c, CommCare_Case_ID__c from Contact WHERE Send_SMS__c = true AND Account.Status__c IN ('Previously Supported', 'Active - CAST Guest User Only') AND 
  LastModifiedDate = LAST_N_DAYS:1`
);

fn(state => ({
  ...state,
  previouslySupportedCaseIds: state.references[0].records.map(record => ({
    CommCare_Case_ID__c: record.CommCare_Case_ID__c,
  })),
}));

query(
  `Select Id, CommCare_Case_ID__c from Contact WHERE Send_SMS__c = true AND Case_Closed_Date_CommCare__c != null AND 
  LastModifiedDate = LAST_N_DAYS:1`
);


query(
  `Select Id, Account.Name, Account.Status__c, CommCare_Case_ID__c from Contact WHERE Send_SMS__c = true AND Account.Status__c = 'Temporarily Suspended' AND 
LastModifiedDate = LAST_N_DAYS:1`
);

fn(state => {
  // logging all 'Account.Status__c' values
  console.log("===logging all 'Account.Status__c' values===");
  state.references.forEach(ref => {
    ref.records.forEach(record => {
      if (record.Account)
        console.log(
          `Account ${record.Account.Name}, Status: ${record.Account.Status__c}`
        );
    });
  });
  console.log('===========================================');
  return state;
});

fn(state => ({
  ...state,
  temporarilySuspendedCaseIds: state.references[0].records.map(
    record => record.CommCare_Case_ID__c
  ),
}));

fn(state => {
  const { temporarilySuspendedCaseIds } = state;

  return query(
    state => `Select Id, Patient__r.CommCare_Case_ID__c, Next_Visit_Date__c from Visit_new__c
    WHERE Patient__r.Send_SMS__c = true AND Patient__r.CommCare_Case_ID__c in ('${temporarilySuspendedCaseIds.join(
      "','"
    )}') AND Next_Visit_Date__c != null`
  )(state).then(state => ({
    ...state,
    temporarilySuspendedCaseIds: state.references[0].records.map(record => {
      return {
        Next_Visit_Date__c: record.Next_Visit_Date__c,
        CommCare_Case_ID__c: record.Patient__r.CommCare_Case_ID__c,
      };
    }),
  }));
});
