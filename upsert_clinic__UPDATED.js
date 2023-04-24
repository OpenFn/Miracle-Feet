// =============================================================================
// New job to support SF migration to Account
// Upsert Clinic records in Salesforce when Location "Hospital" records are
// updated in Commcare.
// =============================================================================
alterState(state => {
    const { test_clinic } = state.data.metadata;
    const location_type = state.data.location_type_code;
    if (test_clinic  === 'Yes') {
      console.log(
        'This is a CommCare test clinic. Not uploading data to Salesforce.'
      );
      return state;
    } else {
      if (location_type === 'clinic') {
        return upsert("Account", "CAST_Location_ID__c", fields(
        field('CAST_Location_ID__c', dataValue('location_id')),
        field('Name', dataValue('name')), 
        field('Country1__c', dataValue('country')), 
        //field('Status__c', 'Future Clinic')//
       ))(state);
      }
      else { 
        console.log(
        'This is not a clinic. Not uploading data to Salesforce.', 
        'it is a', 
        location_type
        );
        return state; }
    }
  }
  )
// Ensure that correct CommCare ID is set in SF as external ID.
