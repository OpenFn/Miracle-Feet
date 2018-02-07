// =============================================================================
// Upsert Clinic records in Salesforce when Location "Hospital" records are
// updated in Commcare.
// =============================================================================
upsert("gciclubfoot__Clinic__c", "gciclubfoot__CAST_Location_ID__c", fields(
  field('gciclubfoot__CAST_Location_ID__c', dataValue('location_id')),
  // Removing this as it's only used in CommCare...
  // field('gciclubfoot__CAST_Site_Code', dataValue('site_code')),
  // Steph to consider adding country or resolve open question on location hierarchy
  field('Name', dataValue('name'))
));
