//Job to update Devices based on new Patient records
 
alterState(state => {
   const discardedClinics = [
    'togo_test_clinic',
    'test_bangladesh',
    'pakistan_test',
    'bol_test',
    'brazil_test',
    'cam_test',
    'bong_test',
    'brazzaville_test',
    'ecu_test',
    'gambia_test',
    'gambia_test_clinic',
    'guat_test',
    'guinea_test_clinic',
    'hon_test',
    'uptest',
    'indonesia_test',
    'test',
    'liberia_test_clinic',
    'madagascar_test_clinic',
    'madagascar_test',
    'majunga_test_clinic',
    'morocco_test',
    'mya_test',
    'nepal_test',
    'nica_prueba',
    'nigeria_test',
    'test_nigeria',
    'par_test',
    'philippines_test',
    'sl_test',
    'test_som',
    'ss_test',
    'sri_lanka_test',
    'test_tanzania_clinic',
    'test_uganda_clinic',
    'test_clinic1',
    'TestMAJ01', 
    'senegal_test_clinic', 
    'uganda_test_clinic', 
    'mali_test',
    'bangladesh_test_clinic',
    'bolivia_test_clinic',
    'brazil_test_clinic',
    'cambodia_test_clinic',
    'congo_test_clinic',
    'ecuador_test_clinic',
    'gautemala_test_clinic',
    'guinea_test_clinic',
    'honduras_test_clinic',
    'india_test_clinic',
    'indonesia_test_clinic',
    'liberia_test_clinic',
    'madagascar_test_clinic',
    'mali_test_clinic',
    'morocco_test_clinic',
    'myanmar_test_clinic',
    'nepal_test_clinic',
    'nicaraugua_test_clinic',
    'nigeria_test_clinic',
    'paraguary_test_clinic',
    'phillipines_test_clinic',
    'senegal_test_clinic',
    'sierra_leone_test_clinic',
    'somalia_test_clinic',
    'test_somalia',
    'south_sudan_test_clinic',
    'sri_lanka_test_clinic',
    'srilanka_test',
    'tanzania_test_clinic',
    'uganda_test_clinic',
    'test_clinic1',
    'test_clinic2',
    'test_clinic3',
    'test_clinic4',
    'haiti_test_clinic',
    'peru_test_clinic',
    'clinica_practica_mexico',
    'guyana_test_clinic',
    'togo_test_clinic', 
    'bafata_test_clinic'
  ];
  const discardedCountries = [
    'Honduras', 
    'Dominican Republic'];
  const { clinic_code } = state.data.form.case.update;
  const { test_clinic } = state.data.form.case.update;
  const { test_user } = state.data.form.case.update;
  if (discardedClinics.includes(clinic_code) || 
      discardedCountries.includes(dataValue('state.data.form.case.update.patient_country')(state)) ||
      test_clinic==='Yes' || test_user==='Yes') {
    console.log(
      'This is a CommCare test clinic or test user. Not uploading data to Salesforce.'
    );
  return state;
  } else {
      return upsert(
          'Devices__c',
          'Device_ID__c', 
        fields(
          field('Device_ID__c', dataValue('metadata.deviceID')),
          relationship(
            'Clinic__r',
            'CAST_Location_ID__c',
            dataValue('form.case.create.owner_id')
          ),
          field('CAST_Version__c', dataValue('metadata.app_build_version')),
          field('CommCare_Version__c', dataValue('metadata.commcare_version')),
          field('CommCare_Username__c', dataValue('metadata.username')),
          field('CommCare_User_ID__c', dataValue('metadata.userID')),
      ))(state);
    }
 }
)
