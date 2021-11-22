query(
  `Select Id, Account.Name, Account.Status__c, CommCare_Case_ID__c from Contact WHERE Send_SMS__c = true AND Account.Status__c IN ('Previously Supported', 'Active - CAST Guest User Only')`
);

fn(state => ({
  ...state,
  previouslySupportedCaseIds: state.references[0].records.map(record => ({
    CommCare_Case_ID__c: record.CommCare_Case_ID__c,
  })),
}));

query(
  `Select Id, Account.Name, Account.Status__c, CommCare_Case_ID__c from Contact WHERE Send_SMS__c = true AND Account.Status__c = 'Temporarily Suspended'`
);

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
