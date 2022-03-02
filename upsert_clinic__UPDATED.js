// =============================================================================
// New job to support SF migration to Account
// Upsert Clinic records in Salesforce when Location "Hospital" records are
// updated in Commcare.
// =============================================================================
alterState(state => {
  const { test_clinic } = state.data.metadata;
  if (test_clinic  === 'Yes') {
    console.log(
      'This is a CommCare test clinic. Not uploading data to Salesforce.'
    );
    return state;
  } else {
      return upsert("Account", "CAST_Location_ID__c", fields(
      field('CAST_Location_ID__c', dataValue('location_id')),
      field('Name', dataValue('name')), 
      field('Country1__c', dataValue('country'))
     ))(state);
    }
  }
)
// Ensure that correct CommCare ID is set in SF as external ID.
