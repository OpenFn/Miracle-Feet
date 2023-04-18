// =============================================================================
// New job for SF migration to new objects
// Upsert Patient records in Salesforce from patient case updates in Commcare.
// =============================================================================
fn(state => {
  state.handleMultiSelect = function (state, multiField) {
    const ms = state.data.properties[`${multiField}`];
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

  //NOTE: Assumes date format YYYY-MM-DD
  state.dateConverter = str => {
    const dateMapper = dateString => {
      const dateStringArray = dateString.split('-');
      const mapper = {
        2: `${dateStringArray[2]}-${dateStringArray[0]}-${dateStringArray[1]}`,
        4: dateString,
      };
      return mapper[dateStringArray[0].length];
    };
    return str && str.trim() !== ''
      ? new Date(dateMapper(str)).toISOString()
      : null;
  };
  
  const discardedClinics = [
    'FRA01', // 'hospital_escuela',
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
    'test_somalia',
    'ss_test',
    'sri_lanka_test',
    'test_tanzania_clinic',
    'test_uganda_clinic',
    'test_clinic1',
    'TestMAJ01', //another?
    'senegal_test_clinic', //another
    'uganda_test_clinic', //another
    'mali_test', //another
    'morocco_test_clinic',
    'sierra_leone_test_clinic',
    'haiti_test_clinic',
    'peru_test_clinic',
    'mali_test_clinic',
    'SBA01',
    'OLA01',
    'clinica_practica_mexico',
    'guyana_test_clinic',
    'togo_test_clinic', 
    'bafata_test_clinic'
  ];
  
  const discardedCountries = [
    'Honduras', 
    'Dominican Republic'];

  return { ...state, discardedClinics, discardedCountries };
});

fn(state => {
  const { clinic_code } = state.data.properties;
  const { test_clinic } = state.data.properties;
  const { test_user } = state.data.properties;
  if (state.discardedClinics.includes(clinic_code) || 
      state.discardedCountries.includes(dataValue('state.data.properties.patient_country')(state)) ||
      test_clinic==='Yes' || test_user==='Yes') {
    console.log(
      'This is a CommCare test clinic or test user. Not uploading data to Salesforce.'
    );
    return state;
  } else {
    const patientData = fields(
      field('CommCare_Case_ID__c', dataValue('case_id')),
      relationship(
        'Account',
        'CAST_Location_ID__c',
        dataValue('properties.owner_id')
      ),
      field('CAST_Patient_ID__c', dataValue('properties.patient_id')),
      field('Age_Months_First_Brace__c', state => {
        var age = dataValue('properties.age_months_first_brace_rounded')(state);
        return age === '0' || age === '' ? null : age;
      }),
      field(
        'Age_Months_Started_Treatment__c',
        dataValue('properties.age_months_start_treatment_rounded')
      ),
      field('Secondary_ID__c', dataValue('properties.secondary_id')),
      field('Secondary_ID_Type__c', dataValue('properties.secondary_id_type')),
      field('Registration_Date__c', state =>
        state.dateConverter(state.data.properties.registration_date)
      ),
      field('Patient_Name__c', humanProper(state.data.properties.patient_name)),
      field('LastName', dataValue('properties.patient_id')),
      // field('FirstName', humanProper(state.data.properties.patient_first_name)),
      // field('LastName', humanProper(state.data.properties.patient_last_name)),
      // ('LastName', state => {
      // var name1 = dataValue('properties.patient_last_name')(state);
      // var name2 = dataValue('properties.patient_name')(state);
      // return name1 ? name1 : name2;
      // }),
      field('Gender__c', humanProper(state.data.properties.patient_gender)), // picklist
      field(
        'Date_of_Birth_Known__c',
        humanProper(state.data.properties.patient_dob_known)
      ), // picklist
      field('Next_Visit_Date_New__c', state =>
        state.dateConverter(state.data.properties.next_visit_date)
      ),
      field('Original_Next_Visit_Date__c', state =>
        state.dateConverter(state.data.properties.original_next_visit_date)
      ),
      field('Birthdate', state =>
        state.dateConverter(state.data.properties.patient_dob)
      ),
      // field('Birthdate', state => {
      //   var patient_dob = state.data.properties.patient_dob;
      //   return patient_dob && patient_dob !== undefined && patient_dob !== ''
      //     ? new Date(state.data.properties.patient_dob).toISOString()
      //     : undefined;
      // }),

      
       field('Date_of_First_Brace__c', state =>
        state.dateConverter(state.data.properties.date_first_brace)
      ),
      // field('Date_of_First_Brace__c', state => {
      //   var dateFirstBrace = state.data.properties.date_first_brace;
      //   return dateFirstBrace && dateFirstBrace !== undefined && dateFirstBrace !== ''
      //     ? new Date(state.data.properties.date_first_brace).toISOString()
      //     : undefined;
      // }),
      field('Date_of_First_Visit__c', state =>
        state.dateConverter(state.data.properties.date_first_visit)
      ),
      field('Date_of_Tenotomy__c', state =>
        state.dateConverter(state.data.properties.date_tenotomy)
      ),
      field('Date_Stopped_Treatment__c', state =>
        state.dateConverter(state.data.properties.stop_date)
      ),
      field('Date_Completed_Treatment__c', state =>
        state.dateConverter(state.data.properties.treatment_completed_date)
      ),
      field(
        'Location_Level_1__c',
        dataValue('properties.location_level1_name')
      ),
      field(
        'Location_Level_2__c',
        dataValue('properties.location_level2_name')
      ),
      field(
        'Location_Level_3__c',
        dataValue('properties.location_level3_name')
      ),
      field(
        'Location_Level_1_Other__c',
        dataValue('properties.location_level1_other')
      ),
      field('City_new__c', dataValue('properties.city')),
      //field('CityTown__c', dataValue('properties.location_level3_name')),
      field('StreetLandmark__c', dataValue('properties.patient_address')), //Changed from Street__c
      field('Neighborhood__c', dataValue('properties.patient_neighborhood')),
      field('Country__c', dataValue('properties.patient_country')),
      field('Zip_Code__c', dataValue('properties.pin_code')),
      field('Most_Recent_Treatment_Left__c', state => {
        var left = state.data.properties.l_treatment;
        var treatment = left
          ? left
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(';')
          : null; //if l_treatment not blank, reformatting choice value as picklist values joined by ;
        return treatment !== null
          ? treatment.toString().replace(/_/g, ' ')
          : null; //remove underscores if l_treatment not blank & return reformatted value
      }),
      field('Most_Recent_Treatment_Right__c', state => {
        var right = state.data.properties.r_treatment;
        var treatment = right
          ? right
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(';')
          : null; //if r_treatment not blank, reformatting choice value as picklist values joined by ;
        return treatment !== null
          ? treatment.toString().replace(/_/g, ' ')
          : null; //remove underscores if r_treatment not blank & return reformatted value
      }),
      field('Abnormalities__c', state => {
        var value = state.data.properties.abnormalities;
        return value ? state.handleMultiSelect(state, 'abnormalities') : null;
      }),
      field(
        'Other_Abnormalities__c',
        dataValue('properties.abnormalities_other')
      ),
      field(
        'Consent_Treatment__c',
        humanProper(state.data.properties.consent_treatment)
      ), // picklist
      field(
        'Consent_Database__c',
        humanProper(state.data.properties.consent_included)
      ), // picklist
      field(
        'Consent_Photograph_Marketing__c',
        humanProper(state.data.properties.consent_photograph_marketing)
      ), // picklist
      field(
        'Consent_Photograph_Treatment__c',
        humanProper(state.data.properties.consent_photograph_treatment)
      ), // picklist
      field('EMR_Consent__c',dataValue('properties.consent_to_use_emr_data_for_program_monitoring')),
      field('Research_Consent__c',dataValue('properties.consent_to_be_contacted_for_future_research_studies')),
      field('Diagnosis__c', humanProper(state.data.properties.diagnosis)), // picklist
      //field('Bracing_Stage__c', (state)=>{}dataValue('properties.bracing_stage')), //replaced with below mapping + transformation
      field('Bracing_Stage__c', state => {
        var stage = dataValue('properties.bracing_stage')(state);
        var newStage =
          stage == 'bracing_all_day'
            ? 'All day and night'
            : stage == 'bracing_night_naps'
            ? 'At night and for naps'
            : null; //transformation that returns formatted CommCare choice values
        return newStage;
      }),
      field('Diagnosis_Idiopathic_Specified__c', state => {
        var value = state.data.properties.diagnosis_idiopathic_specified;
        return value
          ? state.handleMultiSelect(state, 'diagnosis_idiopathic_specified')
          : null;
      }),
      field('Diagnosis_Secondary_Specified__c', state => {
        var value = state.data.properties.diagnosis_secondary_specified;
        return value
          ? state.handleMultiSelect(state, 'diagnosis_secondary_specified')
          : null;
      }),
      field('Diagnosis_Notes__c', dataValue('properties.diagnosis_notes')),
      field(
        'Feet_Affected__c',
        humanProper(state.data.properties.feet_affected)
      ), // picklist
      field('Referral_Source__c', state => {
        const ref = state.data.properties.referral_source;
        var source = '';
        if (ref == 'health_facility') {
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
      field('RBSKDEIC__c', dataValue('properties.referral_source_rbsk_deic')),
      field(
        'Referral_Source_Other__c',
        dataValue('properties.referral_source_other')
      ),
      field(
        'Referral_Source_Health_Facility_Name__c',
        dataValue('properties.referral_source_hf')
      ),
      field(
        'Referral_Source_Doctor_Name__c',
        dataValue('properties.referral_source_doctor')
      ),
      field(
        'Guardian_1_First_Name__c',
        dataValue('properties.guardian1_first_name')
      ),
      field(
        'Guardian_1_Last_Name__c',
        dataValue('properties.guardian1_last_name')
      ),
      field(
        'Guardian_1_Relationship__c',
        humanProper(state.data.properties.guardian1_relationship)
      ), // picklist
      field(
        'Guardian_1_Relationship_Other__c',
        dataValue('properties.guardian1_relationship_other')
      ),
      field(
        'Guardian_1_Phone_Number_1__c',
        dataValue('properties.guardian1_phone1_full')
      ),
      field(
        'Guardian_1_Phone_Number_2__c',
        dataValue('properties.guardian1_phone2')
      ),
      field('Send_SMS__c', state => {
        var sms = dataValue('properties.send_sms')(state);
        var opt = sms && sms == 'on' ? true : sms && sms == 'off' ? false : '';
        return opt;
      }),
      field('SMS_Opt_In__c', state => {
        var sms = dataValue('properties.sms_opt_in')(state);
        var opt = sms && sms == 'yes' ? true : sms && sms == 'no' ? false : '';
        return opt;
      }),
      field('SMS_Opt_In_II__c', state => {
        var sms = dataValue('properties.sms_opt_in_educational')(state);
        var opt = sms && sms == 'yes' ? true : sms && sms == 'no' ? false : '';
        return opt;
      }),
      field('Date_of_SMS_Registration__c', state => {
        var smsDate = state.data.properties.date_of_sms_registration;
        return smsDate && smsDate !== undefined && smsDate !== ''
          ? state.dateConverter(smsDate)
          : undefined;
      }),
      field('Pronoun_he_she__c', dataValue('properties.pronoun_he_she')),
      field('Pronoun_him_her__c', dataValue('properties.pronoun_him_her')),
      field('Pronoun_his_her__c', dataValue('properties.pronoun_his_her')),
      field('SMS_Timezone__c', dataValue('properties.time_zone')),
    //  field('SMS_Language__c', dataValue('form.calcs.sms.sms_language')),//added by Beth
    //  field('SMS_Treatment__c',dataValue('properties.treatment')),//added by Beth

      field(
        'Guardian_2_First_Name__c',
        dataValue('properties.guardian2_first_name')
      ),
      field(
        'Guardian_2_Last_Name__c',
        dataValue('properties.guardian2_last_name')
      ),
      field(
        'Guardian_2_Relationship__c',
        humanProper(state.data.properties.guardian2_relationship)
      ), // picklist
      field(
        'Guardian_2_Other_Relationship__c',
        dataValue('properties.guardian2_relationship_other')
      ),
      field(
        'Guardian_2_Phone_Number_1__c',
        dataValue('properties.guardian2_phone1')
      ),
      field(
        'Guardian_2_Phone_Number_2__c',
        dataValue('properties.guardian2_phone2')
      ),
      field(
        'Guardian_3_First_Name__c',
        dataValue('properties.guardian3_first_name')
      ),
      field(
        'Guardian_3_Last_Name__c',
        dataValue('properties.guardian3_last_name')
      ),
      field(
        'Guardian_3_Relationship__c',
        humanProper(state.data.properties.guardian3_relationship)
      ), // picklist
      field(
        'Guardian_3_Relationship_Other__c',
        dataValue('properties.guardian3_relationship_other')
      ),
      field(
        'Guardian_3_Phone_Number_1__c',
        dataValue('properties.guardian3_phone1')
      ),
      field(
        'Guardian_3_Phone_Number_2__c',
        dataValue('properties.guardian3_phone2')
      ),
      field(
        'Tenotomy_Given__c',
        humanProper(state.data.properties.tenotomy_given)
      ), // picklist
      field('Tenotomy_Hospital__c', dataValue('properties.tenotomy_hospital')),
      field('Tenotomy_Provider__c', dataValue('properties.tenotomy_provider')),
      field(
        'Tenotomy_Reason_Not_Given__c',
        humanProper(state.data.properties.tenotomy_reason_not_given)
      ), // picklist
      field('Transfer_Date__c', state =>
        state.dateConverter(state.data.properties.transfer_date)
      ),
      field(
        'Stopped_Treatment_Reason_Other__c',
        dataValue('properties.stop_reason_other')
      ),
      field(
        'TribeEthnicity__c',
        humanProper(state.data.properties.tribe_ethnicity)
      ),
      field('Dropout__c', state =>
        state.data.properties.dropout == 'dropout' ? true : false
      ),
      field(
        'Clinic_Transferred_To__c',
        dataValue('properties.transfer_clinic')
      ),
      field(
        'Case_Closed_by_Username_CommCare__c',
        dataValue('properties.closed_by_username')
      ),
      field('Opened_Date_CommCare__c', state =>
        state.dateConverter(state.data.properties.date_opened.split('T')[0])
      ),
      //Hello beth
      /*  Deleted because it was running an Error in Salesforce 
      field(
        'Opened_By_Username_CommCare__c',
        dataValue('properties.opened_by_username')
      ),*/

      field('Last_Modified_Date_CommCare__c', state =>
        state.dateConverter(state.data.date_modified)
      ),
      field(
        'Last_Modified_By_Username_CommCare__c',
        dataValue('properties.last_modified_by_username')
      ),
      field('Case_Closed_Date_CommCare__c', state =>
        state.dateConverter(state.data.date_closed)
      ),
      field(
        'Reason_Stopped_Treatment__c',
        humanProper(state.data.properties.close_reason)
      ), // picklist
      field('ICR_ID__c', dataValue('properties.patient_original_id')),
      field('Owner_Name_CommCare__c', dataValue('owner_name')),
      field('Duplicate_Patient__c', state =>
        state.data.properties.duplicate_patient == '1' ? true : false
      ),
      field('Treatment_Completed__c', state =>
        state.data.properties.treatment_completed == '1' ? true : false
      ),
      field('Treatment_Postponed_due_to_Covid_19__c', state => {
        var delay = dataValue('properties.delay_treatment')(state); // in commcare, if yes, needs to checkbox in salesforce
        return delay === 'yes' ? true : false;
      }),
      field(
        'R_First_Brace_Pirani_Score__c',
        dataValue('properties.r_first_brace_pirani_score')
      ),
      field(
        'L_First_Brace_Pirani_Score__c',
        dataValue('properties.l_first_brace_pirani_score')
      ),
      field(
        'L_First_Pirani_Score__c',
        dataValue('properties.l_first_pirani_score')
      ),
      field(
        'R_First_Pirani_Score__c',
        dataValue('properties.r_first_pirani_score')
      ),
      field(
        'L_Most_Recent_Pirani_Score__c',
        dataValue('properties.l_total_score')
      ),
      field(
        'R_Most_Recent_Pirani_Score__c',
        dataValue('properties.r_total_score')
      ),
      field(
        'R_Pirani_Score_at_Tenotomy__c',
        dataValue('properties.r_tenotomy_pirani_score')
      ),
      field(
        'L_Pirani_Score_at_Tenotomy__c',
        dataValue('properties.l_tenotomy_pirani_score')
      ),
      field('Patient_Pay_Status__c', state => {
        var status = dataValue('properties.patient_pay_status')(state);
        return status == 'charity_or_ultra_poor'
          ? 'Charity or Ultra Poor'
          : status == 'self_paying'
          ? 'Self Paying'
          : status;
      }),
      field('Patient_Donor__c', state => {
        var donor = dataValue('properties.patient_donor')(state);
        return donor == 'miraclefeet' ? 'miraclefeet' : 
          donor == 'cbm' ? 'CBM' :
          donor=='AoP' ? 'AoP' :
          donor=='SOFTEX' ? 'SOFTEX' :
          donor == 'other' ? 'Others' : donor;
      }),
      field(
        'Other_Type_Donor_Name__c', //removed extra period after field
        dataValue('properties.other_donor')
      ),
      field(
        'Tenotomy_Reason_Not_Given_Other__c',
        dataValue('tenotomy_reason_not_given_other')
      ),
      field('CommCare_Version__c', dataValue('metadata.commcare_version')),
      field('CAST_Version__c', dataValue('metadata.app_build_version')),
      field('CommCare_Username__c', dataValue('metadata.username')),
      field('CommCare_User_ID__c', dataValue('user_id'))
    );

    return upsertIf(
      state.data.date_modified != state.data.properties.date_opened + '000Z',
      'Contact',
      'CommCare_Case_ID__c',
      patientData
    )(state);
  }
});
