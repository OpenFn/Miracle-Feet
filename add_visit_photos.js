upsert("gciclubfoot__Visit__c", "gciclubfoot__commcare_case_id__c", fields(
  field('gciclubfoot__commcare_case_id__c', dataValue('form.case.@case_id')),
  field("Photo_1_URL__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.photo1}`
  })
  field("Photo_2_URL__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.photo1}`
  })
field("Photo_3_URL__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/";
    const uuid = state.data.metadata.instanceID;
    return `${baseUrl}${uuid}/${state.data.form.photos.photo1}`
  })
));
