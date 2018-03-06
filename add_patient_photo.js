upsert("gciclubfoot__Patient__c", "gciclubfoot__CommCare_Case_ID__c", fields(
  field('gciclubfoot__CommCare_Case_ID__c', dataValue("form.case.@case_id")),
  field("Photo_1__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/"
    const uuid = state.data.metadata.instanceID

    return `${baseUrl}${uuid}/${state.data.form.photos.photo1}`

  })
));
