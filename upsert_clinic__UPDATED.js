// =============================================================================
// New job to support SF migration to Account
// Upsert Clinic records in Salesforce when Location "Hospital" records are
// updated in Commcare.
// =============================================================================
upsert("Account", "CAST_Location_ID__c", fields(
  field('CAST_Location_ID__c', dataValue('location_id')),
  field('Name', dataValue('name'))
));
// Ensure that correct CommCare ID is set in SF as external ID.
