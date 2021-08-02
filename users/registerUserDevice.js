
upsert(
  'Devices',
  'Device_ID__c') //replace bracket with comma
  fields(
    //field('Device_ID__c', dataValue('XYZ')), //you need to specify where this unique id comes from if using to upsert
    field('CommCare_User_ID__c', dataValue('id')),
    relationship(
          'Account',
          'CAST_Location_ID__c',
          dataValue('user_data.commcare_location_id')),
    field('SMS_Turned_On__c',dataValue('user_data.send_sms'))
  )
//missing closing bracket

      