upsert("clinic__c", "uuid__c", fields(
  field('CAST Location ID', dataValue('properties.location_id')),
  field('CAST Site Code', dataValue('properties.site_code')),
  field('Name', dataValue('properties.name')),
  field('CAST Parent Site Code', dataValue('properties.parent_site_code'))
));
