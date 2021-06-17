//Job to update Devices based on new Patient records
upsert(
    'Devices__c',
    'Device_ID__c', 
  fields(
    field('Device_ID__c',dataValue('form.case.@case_id')),
    relationship(
      'Clinic__r',
      'CAST_Location_ID__c',
      dataValue('form.case.create.owner_id')
    ),
    field('CAST_Version__c',dataValue('metadata.app_build_version')),
    field('CommCare_Version__c',dataValue('form.meta.commcare_version')),
    field('CommCare_Username__c',dataValue('metadata.username')),
    field('CommCare_User_ID__c',dataValue('metadata.userID'))
));

