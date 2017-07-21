// =============================================================================
// Create Patient records in Salesforce when the Patient Registration form is
// submitted in CommCare. We're just doing this to show photo URLs in use.
// =============================================================================
create("Patient__c", fields(
  field("Photo_1__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/"
    return `${baseUrl}${state.meta.instanceID}/${state.data.photos[0]}`
  }),
  field("Photo_2__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/"
    return `${baseUrl}${state.meta.instanceID}/${state.data.photos[1]}`
  }),
  field("Photo_3__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/"
    return `${baseUrl}${state.meta.instanceID}/${state.data.photos[2]}`
  }),
  field("Photo_4__c", function(state) {
    const baseUrl = "https://www.commcarehq.org/a/clubfoot/api/form/attachment/"
    return `${baseUrl}${state.meta.instanceID}/${state.data.photos[3]}`
  })
))
