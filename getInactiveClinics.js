query(
  `Select Id, CommCare_Case_ID__c from Contact WHERE Account.Status__c = 'Previously Supported'`
);

fn(state => ({
  ...state,
  previouslySupportedCaseIds: state.references[0].records.map(record => ({
    CommCare_Case_ID__c: record.CommCare_Case_ID__c,
  })),
}));

query(
  `Select Id, CommCare_Case_ID__c from Contact WHERE Account.Status__c = 'Temporarily Suspended'`
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
    WHERE Patient__r.CommCare_Case_ID__c in ('${temporarilySuspendedCaseIds.join(
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