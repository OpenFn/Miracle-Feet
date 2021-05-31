alterState(state => {
  state.handlePhoto = function handlePhoto(state, photoField) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos
      ? state.data.form.photos[`${photoField}`]
      : null;
    return image ? `${baseUrl}${uuid}/${image}` : '';
  };

  state.handleMultiSelect = function (state, multiField) {
    const ms = state.data.form.case.update[`${multiField}`];
    if (ms) {
      return ms
        .replace(/ /gi, ';')
        .toLowerCase()
        .split(';')
        .map(value => {
          return humanProper(value);
        })
        .join(';');
    } else {
      return '';
    }
  };

  const discardedClinics = [
    'test_bangladesh',
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
    'tanzania_test_clinic',
    'uganda_test_clinic',
    'test_clinic1',
    'test_clinic2',
    'test_clinic3',
    'test_clinic4',
  ];

  state.dateConverter = function (state, dateString) {
    return dateString ? new Date(dateString).toISOString() : null;
  };

  return { ...state, discardedClinics };
});

alterState(state => {
  const { clinic_code } = state.data.form.case.update;
  if (state.discardedClinics.includes(clinic_code)) {
    console.log(
      'This is a CommCare test clinic. Not uploading data to Salesforce.'
    );
    return state;
  } else {
    return upsert(
      'Contact',
      'CommCare_Case_ID__c',
      fields(
        field('CommCare_Case_ID__c', dataValue('form.case.@case_id')),
        relationship(
          'Account',
          'CAST_Location_ID__c',
          dataValue('form.case.create.owner_id')
        ),
        field(
            'SMS_Opt_In_II__c', state => {
            var sms = dataValue('properties.sms_interest_educational')(state);
            var opt = sms && sms=='yes' ? true : sms && sms=='no' ? false : ''; 
          return opt; 
          }),
        field('Patient_Name__c', dataValue('form.case.update.patient_name')),
        field('FirstName', dataValue('form.case.update.patient_first_name')),
        field('LastName', dataValue('form.case.update.patient_last_name')),
        field('CAST_Patient_ID__c', dataValue('form.case.update.patient_id')),
        field(
          'Age_Months_First_Brace__c',
           state => {
            var age = dataValue('form.case.update.age_months_first_brace_rounded')(state); 
            return age === '0' || age === '' ? null : age;
        }),
        field(
          'Age_Months_Started_Treatment__c',
          dataValue('form.case.update.age_months_start_treatment_rounded')
        ),
        field(
          'Secondary_ID__c',
          dataValue('form.case.update.patient_file_number')
        ),
        field(
          'Secondary_ID_Type__c',
          dataValue('form.case.update.secondary_id_type')
        ),
        field('Registration_Date__c', state => {
          return state.dateConverter(
            state,
            state.data.form.case.update.registration_date
          );
        }),
        field('Gender__c', dataValue('form.case.update.patient_gender')),
        field(
          'Date_of_Birth_Known__c',
          dataValue('form.case.update.patient_dob_known')
        ),
        field('Birthdate', state => {
          return state.dateConverter(
            state,
            state.data.form.case.update.patient_dob
          );
        }),
        field('Date_of_First_Brace__c', state => {
          return state.dateConverter(
            state,
            state.data.form.case.update.date_first_brace
          );
        }),
        /*field('Date_of_First_Visit__c', state => { //not present in patient form, only visit forms
          return state.dateConverter(
            state,
            state.data.form.case.update.date_first_visit
          );
        }),*/
        field('Date_of_Tenotomy__c', state => {
          return state.dateConverter(
            state,
            state.data.form.case.update.date_tenotomy
          );
        }),
        field(
          'Tenotomy_Reason_Not_Given_Other__c',
          dataValue('form.case.update.tenotomy_reason_not_given_other')
          ),
        field('Date_Stopped_Treatment__c', state => {
          return state.dateConverter(
            state,
            state.data.form.case.update.stop_date
          );
        }),
        field(
          'Location_Level_1__c',
          dataValue('form.case.update.location_level1_name')
        ),
        field(
          'Location_Level_2__c',
          dataValue('form.case.update.location_level2_name')
        ),
        field(
          'Location_Level_3__c',
          dataValue('form.case.update.location_level3_name')
        ),
        field(
          'Location_Level_1_Other__c',
          dataValue('form.case.update.location_level1_other')
        ),
        field('Country__c', dataValue('form.case.update.patient_country')),
        field('City_new__c', dataValue('form.case.update.city')),
        //field('CityTown__c', dataValue('form.case.update.location_level3')),
        field(
          'StreetLandmark__c',
          dataValue('form.case.update.patient_address')
        ),
        field(
          'Neighborhood__c',
          dataValue('form.case.update.patient_neighborhood')
        ),
        field('Abnormalities__c', state => {
          return state.handleMultiSelect(state, 'abnormalities');
        }),
        field(
          'Other_Abnormalities__c',
          dataValue('form.case.update.abnormalities_other')
        ),
        field(
          'Consent_Treatment__c',
          dataValue('form.case.update.consent_treatment')
        ),
        field(
          'Consent_Database__c',
          dataValue('form.case.update.consent_included')
        ),
        field(
          'Consent_Photograph_Marketing__c',
          dataValue('form.case.update.consent_photograph_marketing')
        ),
        field(
          'Consent_Photograph_Treatment__c',
          dataValue('form.case.update.consent_photograph_treatment')
        ),
        field('Diagnosis__c', dataValue('form.case.update.diagnosis')),
        field('Diagnosis_Idiopathic_Specified__c', state => {
          return state.handleMultiSelect(
            state,
            'diagnosis_idiopathic_specified'
          );
        }),
        field('Diagnosis_Secondary_Specified__c', state => {
          const ms = state.data.form.case.update.diagnosis_secondary_specified;
          if (ms) {
            return ms
              .replace(/ /gi, ';')
              .toLowerCase()
              .split(';')
              .map(value => {
                return humanProper(value);
              })
              .join(';');
          } else {
            return '';
          }
        }),
        field(
          'Diagnosis_Notes__c',
          dataValue('form.case.update.diagnosis_notes')
        ),
        field('Feet_Affected__c', dataValue('form.case.update.feet_affected')),
        field('Referral_Source__c', state => {
          const ref = state.data.form.referral_source.referral_source;
          var source = '';
          if (ref == undefined) {
            source = state.data.form.referral_source.referral_source_india;
          } else if (ref == 'health_facility') {
            source = 'Hospital or Clinic';
          } else if (ref == 'midwife') {
            source = 'Midwife';
          } else if (ref == 'chw') {
            source = 'Community Health Worker';
          } else if (ref == 'promotional_material') {
            source = 'Promotional Material';
          } else if (ref == 'clubfoot_patient') {
            source = 'Clubfoot Patient';
          } else if (ref == 'community_member') {
            source = 'Community Member';
          } else if (ref == 'rbsk_deic') {
            source = 'RBSK DEIC';
          } else if (ref == 'other') {
            source = 'Other';
          } else {
            source = 'Not Defined';
          }
          return source;
        }),
        field('Treatment_Postponed_due_to_Covid_19__c', state => {
          var delay = dataValue('form.case.update.delay_treatment')(state); // in commcare, if yes, needs to checkbox in salesforce
          return delay === 'yes' ? true : false;
        }),
        field(
          'RBSKDEIC__c',
          dataValue('form.case.update.referral_source_rbsk_deic')
        ),
        field(
          'Referral_Source_Other__c',
          dataValue('form.case.update.referral_source_other')
        ),
        field(
          'Referral_Source_Health_Facility_Name__c',
          dataValue('form.case.update.referral_source_hf')
        ),
        field(
          'Referral_Source_Doctor_Name__c',
          dataValue('form.case.update.referral_source_doctor')
        ),
        field(
          'Guardian_1_First_Name__c',
          dataValue('form.case.update.guardian1_first_name')
        ),
        field(
          'Guardian_1_Last_Name__c',
          dataValue('form.case.update.guardian1_last_name')
        ),
        field(
          'Guardian_1_Relationship__c',
          dataValue('form.case.update.guardian1_relationship')
        ),
        field(
          'Guardian_1_Relationship_Other__c',
          dataValue('form.case.update.guardian1_relationship_other')
        ),
        field(
          'Guardian_1_Phone_Number_1__c',
          dataValue('form.case.update.guardian1_phone1')
        ),
        field(
          'Guardian_1_Phone_Number_2__c',
          dataValue('form.case.update.guardian1_phone2')
        ),
        field(
          'Guardian_2_First_Name__c',
          dataValue('form.case.update.guardian2_first_name')
        ),
        field(
          'Guardian_2_Last_Name__c',
          dataValue('form.case.update.guardian2_last_name')
        ),
        field(
          'Guardian_2_Relationship__c',
          dataValue('form.case.update.guardian2_relationship')
        ),
        field(
          'Guardian_2_Other_Relationship__c',
          dataValue('form.case.update.guardian2_relationship_other')
        ),
        field(
          'Guardian_2_Phone_Number_1__c',
          dataValue('form.case.update.guardian2_phone1')
        ),
        field(
          'Guardian_2_Phone_Number_2__c',
          dataValue('form.case.update.guardian2_phone2')
        ),
        field(
          'Guardian_3_First_Name__c',
          dataValue('form.case.update.guardian3_first_name')
        ),
        field(
          'Guardian_3_Last_Name__c',
          dataValue('form.case.update.guardian3_last_name')
        ),
        field(
          'Guardian_3_Relationship__c',
          dataValue('form.case.update.guardian3_relationship')
        ),
        field(
          'Guardian_3_Relationship_Other__c',
          dataValue('form.case.update.guardian3_relationship_other')
        ),
        field(
          'Guardian_3_Phone_Number_1__c',
          dataValue('form.case.update.guardian3_phone1')
        ),
        field(
          'Guardian_3_Phone_Number_2__c',
          dataValue('form.case.update.guardian3_phone2')
        ),
        field(
          'Tenotomy_Given__c',
          dataValue('form.case.update.tenotomy_given')
        ),
        field(
          'Tenotomy_Hospital__c',
          dataValue('form.case.update.tenotomy_hospital')
        ),
        field(
          'Tenotomy_Provider__c',
          dataValue('form.case.update.tenotomy_provider')
        ),
        field(
          'Tenotomy_Reason_Not_Given__c',
          dataValue('form.case.update.tenotomy_reason_not_given')
        ),
        field('Transfer_Date__c', state => {
          return state.dateConverter(
            state,
            state.data.form.case.update.transfer_date
          );
        }),
        field(
          'Stopped_Treatment_Reason_Other__c',
          dataValue('form.case.update.stop_reason_other')
        ),
        field(
          'TribeEthnicity__c',
          dataValue('form.case.update.tribe_ethnicity')
        ),
        field(
          'Clinic_Transferred_To__c',
          dataValue('form.case.update.transfer_clinic')
        ),
        field('Opened_Date_CommCare__c', state => {
          const validDate =
            state.data.form.commcare_usercase.case['@date_modified'];
          return state.dateConverter(state, validDate);
        }),
        field(
          'Reason_Stopped_Treatment__c',
          dataValue('form.case.update.close_reason')
        ),
        field('ICR_ID__c', dataValue('form.case.update.patient_original_id')),
        field('Treatment_Completed__c', state => {
          return state.data.form.case.update.treatment_completed == '1'
            ? true
            : false;
        }),
        field('Registration_Photo_1__c', function (state) {
          return state.handlePhoto(state, 'photo1');
        }),
        field('Registration_Photo_2__c', function (state) {
          return state.handlePhoto(state, 'photo2');
        }),
        field('Registration_Photo_3__c', function (state) {
          return state.handlePhoto(state, 'photo3');
        }),
        field('Registration_Photo_4__c', function (state) {
          return state.handlePhoto(state, 'photo4');
        }),
        field('Consent_Signature__c', function (state) {
          return state.handlePhoto(state, 'guardian_signature');
        }),
        field(
          'R_First_Brace_Pirani_Score__c',
          dataValue('form.case.update.r_first_brace_pirani_score')
        ),
        field(
          'L_First_Brace_Pirani_Score__c',
          dataValue('form.case.update.l_first_brace_pirani_score')
        ),
        field(
          'L_First_Pirani_Score__c',
          dataValue('form.case.update.l_first_pirani_score')
        ),
        field(
          'R_First_Pirani_Score__c',
          dataValue('form.case.update.r_first_pirani_score')
        ),
        field(
          'L_Most_Recent_Pirani_Score__c',
          dataValue('form.case.update.l_total_score')
        ),
        field(
          'R_Most_Recent_Pirani_Score__c',
          dataValue('form.case.update.r_total_score')
        ),
        field(
          'R_Pirani_Score_at_Tenotomy__c',
          dataValue('form.case.update.r_tenotomy_pirani_score')
        ),
        field(
          'L_Pirani_Score_at_Tenotomy__c',
          dataValue('form.case.update.l_tenotomy_pirani_score')
        ),
        field(
          'Patient_Pay_Status__c', state => {
            var status = dataValue('form.registration_info.patient_pay_status')(state); 
            return status=='charity_or_ultra_poor' ? 'Charity or Ultra Poor' : 
              status=='self_paying' ? 'Self Paying' : status; 
          }),
        field(
          'Patient_Donor__c',state => {
            var donor = dataValue('form.registration_info.patient_donor')(state); 
            return donor=='miraclefeet' ? 'MF' : 
              donor=='cbm' ? 'CBM' : 
              donor=='other' ? 'Others' : donor; 
          }),
        field(
          'Other_Type_Donor_Name__c', //removed extra period after field
          dataValue('form.registration_info.other_donor')
        ),
        field(
          'CommCare_Version__c',
          dataValue('form.meta.commcare_version')
        ),
        field(
          'CAST_Version__c',
          dataValue('form.meta.app_build_version')
        ),
              )
    )(state);
  }
});

