upsert(
    'Devices',
    'Device_ID__c')
fields(
    field('CommCare_User_ID__c', dataValue('id')),
    relationship(
        'Account',
        'CAST_Location_ID__c',
        dataValue('user_data.commcare_location_id')),
    field('SMS_Turned_On__c', dataValue('user_data.send_sms'))
)
