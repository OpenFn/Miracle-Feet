upsert("gciclubfoot__Patient__c", "gciclubfoot__CommCare_Case_ID__c", fields(
  field('gciclubfoot__CommCare_Case_ID__c', dataValue("form.case.@case_id")),
  relationship('gciclubfoot__Clinic__r', 'gciclubfoot__CAST_Location_ID__c', dataValue('form.case.create.owner_id')),
  field('gciclubfoot__First_Name__c', dataValue('form.case.update.patient_first_name')),
  field('gciclubfoot__Last_Name__c', dataValue('form.case.update.patient_last_name')),
  field("gciclubfoot__Registration_Photo_1__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo1;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Registration_Photo_2__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo2;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Registration_Photo_3__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo3;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Registration_Photo_4__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo4;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Consent_Signature__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.guardian_signature;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  })
));
