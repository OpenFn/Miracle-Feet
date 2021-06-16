//Job to update Devices based on new Patient records
upsert(
  'Devices__c',
  'Device_ID__c', 
 fields(
  field('Device_ID__c',dataValue('metadata.deviceID')),
  relationship(
    'Clinic_r',
    'CAST_Location_ID__c',
    dataValue('form.case.create.owner_id')
    ),
    field('CAST_Version__c',dataValue('metadata.app_build_version')),
    field('CommCare_Version__c',dataValue('metadata.commcare_version')),
    field('CommCare_Username__c',dataValue('metadata.username')),
    field('CommCare_User_ID__c',dataValue('metadata.userID')),
));
