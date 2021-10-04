query(
  `Select Id, CommCare_Case_ID__c from Contact WHERE Account.Status__c = 'Previously Supported'`
);

fn(state => ({
  ...state,
  previouslySupportedCaseIds: state.references[0].records.map(record => record.CommCare_Case_ID__c),
}));

query(
  `Select Id, CommCare_Case_ID__c from Contact WHERE Account.Status__c = 'Temporarily Suspended'`
);

fn(state => ({
  ...state,
  temporarilySuspendedCaseIds: state.references[0].records.map(record => record.CommCare_Case_ID__c),
}));
