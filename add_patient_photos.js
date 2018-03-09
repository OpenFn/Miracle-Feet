upsert("gciclubfoot__Patient__c", "gciclubfoot__CommCare_Case_ID__c", fields(
  field('gciclubfoot__CommCare_Case_ID__c', dataValue("form.case.@case_id")),
  field("gciclubfoot__Registration_Photo_1__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.photo1}`
  }),
  field("gciclubfoot__Registration_Photo_2__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.photo2}`
  }),
  field("gciclubfoot__Registration_Photo_3__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.photo3}`
  }),
  field("gciclubfoot__Registration_Photo_4__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.photo4}`
  }),
  field("gciclubfoot__Consent_Signature__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.guardian_signature}`
  })
));
