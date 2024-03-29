// =============================================================================
// New job to support SF migration to Account
// Upsert Clinic records in Salesforce when Location "Hospital" records are
// updated in Commcare.
// =============================================================================


  //Get Partner clinic id from the MiracleFeet Partner field   
  // if (metadata.miraclefeet_partner) {
    query(
      `SELECT Account.Id FROM Account 
          WHERE Name = '${dataValue('metadata.miraclefeet_partner')(
            state
          )}'`
    ),
    fn(state => ({
      ...state,
      data: {
        ...state.data,
        parentClinicId: state.references[0].records && state.references[0].records.length !== 0
        ? state.references[0].records[0].Id
        : undefined,
        //save id of Partner clinic to map later
      },
    }));
 /* } else {
    fn({
      ...state,
      data: {
        ...state.data,
        parentClinicId: null,
        },
      })
  }*/
  
alterState(state => {
    const { test_clinic } = state.data.metadata;
    const location_type = state.data.location_type_code;

    if (test_clinic.toLowerCase()  === 'yes') {

      console.log(
      'This is a CommCare test clinic. Not uploading data to Salesforce.', 
      'The parent partner ID is:', 
        state.data.parentClinicId
      );
      return state;
    } else {
      if (location_type.toLowerCase() === 'clinic') {
      

        return upsert("Account", "CAST_Location_ID__c", 
        fields(
          field('ParentId', state.data.parentClinicId),
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
