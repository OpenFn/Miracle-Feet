// =============================================================================
// Upsert Clinic records in Salesforce when Location "Hospital" records are
// updated in Commcare.
// test, feb 6th
// =============================================================================
upsert("gciclubfoot__Clinic__c", "gciclubfoot__CAST_Location_ID", fields(
  field('gciclubfoot__CAST_Location_ID', dataValue('properties.location_id')),
  field('CAST Site Code', dataValue('properties.site_code')),
  field('Name', dataValue('properties.name')),
  field('CAST Parent Site Code', dataValue('properties.parent_site_code'))
));
