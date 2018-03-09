upsert("gciclubfoot__Visit__c", "gciclubfoot__commcare_case_id__c", fields(
  field('gciclubfoot__commcare_case_id__c', dataValue('form.case.@case_id')),
  relationship('gciclubfoot__Patient__r', "gciclubfoot__CommCare_Case_ID__c", dataValue('form.subcase_0.case.@case_id')),
  field("gciclubfoot__Photo_1_URL__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo1;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Photo_2_URL__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo2;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Photo_3_URL__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo3;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  })
));
