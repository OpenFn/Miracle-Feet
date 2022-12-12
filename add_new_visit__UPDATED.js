//New job for upserting Visits post SF migration
fn(state => {
  state.handlePhoto = function handlePhoto(state, photoField) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const hasPhotos =
      state.data.form.photos && state.data.form.photos.add_photos == 'yes';
    const image = hasPhotos
      ? state.data.form.photos.photos[`${photoField}`]
      : null;
    return image ? `${baseUrl}${uuid}/${image}` : '';
  };
  
state => {
  state.handleBracePhoto = function handleBracePhoto(state, photoField) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const hasPhotos =
      state.data.form.brace.brace_problems.brace_problems_type == 'broken_defective_brace';
    const image = hasPhotos
      ? state.data.form.brace.brace_problems[`${photoField}`]
      : null;
    return image ? `${baseUrl}${uuid}/${image}` : '';
  };

  state.handleMultiSelect = function (state, multiField) {
    const ms = state.data.form.subcase_0.case.update[`${multiField}`];
    if (ms) {
      return ms
        .replace(/ /gi, ';')
        .toLowerCase()
        .split(';')
        .map(value => {
          return humanProper(value); //returns every word in string as UpperCase first letter
        })
        .join(';');
    } else {
      return '';
    }
  };

  state.handleMultiSelectFirstCap = function (state, multiField) {
    const ms = state.data.form.subcase_0.case.update[`${multiField}`];
    if (ms) {
      return ms
        .replace(/ /gi, ';')
        .toLowerCase()
        .split(';')
        .map(value => {
          return value.charAt(0).toUpperCase() + value.substring(1); //return only first letter of entire string as UpperCase
        })
        .join(';');
    } else {
      return '';
    }
  };

  const braceMap = {
    dobbs_or_mitchell: 'Dobbs or Mitchell',
    iowa: 'Iowa',
    miraclefeet: 'MiracleFeet',
    steenbeek: 'Steenbeek',
    other: 'Other',
    ankle_foot_orthosis_afo: 'Ankle Foot Orthosis (AFO)',
  };

  const braceProblemsTypeMap = {
    feet_slipping: 'Feet Slipping',
    none: 'None',
    motion_range: 'Motion Range',
    not_wearing_enough: 'Not Wearing Enough',
    child_not_tolerating: 'Child Not Tolerating',
    family_not_accepting: 'Family Not Accepting',
    incorrect_shoe_size: 'Incorrect Shoe Size',
    skin_irritation: 'Skin Irritation',
    broken_defective_brace: 'Broken Defective Brace',
    other: 'Other',
  };

  const discardedClinics = [
    'test_bangladesh',
    'bol_test',
    'brazil_test',
    'cam_test',
    'bong_test',
    'brazzaville_test',
    'ecu_test',
    'Facorc_test',
    'gambia_test',
    'gambia_test_clinic',
    'guat_test',
    'guinea_test_clinic',
    'hon_test',
    'uptest',
    'indonesia_test',
    'test',
    //'majunga_test_clinic',
    'madagascar_test',
    'morocco_test',
    'morocco_test_clinic',
    'mya_test',
    'nepal_test',
    'nica_prueba',
    'nigeria_test',
    'par_test',
    'philippines_test',
    'sl_test',
    'test_som',
    'ss_test',
    'sri_lanka_test',
    'test_tanzania_clinic',
    'test_uganda_clinic',
    'test_clinic1',
    //'TestMAJ01',
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
    //'nigeria_test_clinic',
    //'test_nigeria',
    'paraguary_test_clinic',
    'phillipines_test_clinic',
    'senegal_test_clinic',
    'sierra_leone_test_clinic',
    'somalia_test_clinic',
    'south_sudan_test_clinic',
    'sri_lanka_test_clinic',
    'tanzania_test_clinic',
    'uganda_test_clinic',
    'test_clinic1',
    'test_clinic2',
    'test_clinic3',
    'test_clinic4',
    'haiti_test_clinic',
    'sierra_leone_test_clinic',
    'mali_test_clinic',
    'peru_test_clinic',
  ];

  const RTmap = {
    casting: '0123l000001g0XtAAI', //Casting
    tenotomy: '0123l000001g0Y3AAI', //Tenotomy
    bracing_night: '0123l000001g0XoAAI', //Bracing
    bracing_day: '0123l000001g0XoAAI', //Bracing
    suspended: '0123l000001g0XyAAI',
    complete: '0123l000001g0XyAAI',
  };

  state.dateConverter = function (dateString) {
    return dateString ? new Date(dateString).toISOString() : null;
  };

  return { ...state, discardedClinics, braceMap, braceProblemsTypeMap, RTmap };
});

fn(state => {
  const treatmentMap = {
    casting: 'Casting',
    tenotomy: 'Tenotomy',
    bracing_night: 'Bracing Night',
    bracing_day: 'Bracing Day',
    suspended: 'Suspended',
    complete: 'Complete',
  };

  const { clinic_code } = state.data.form.calcs.case_properties;
  if (state.discardedClinics.includes(clinic_code)) {
    console.log(
      'This is a CommCare test clinic. Not uploading data to Salesforce.'
    );
    return state;
  } else {
    const getSMS = (state, type) => {
      if (type === 'Send_SMS__c') {
        const sms = state.data.form.calcs.sms.send_sms;
        return sms && sms == 'on' ? true : sms && sms == 'off' ? false : '';
      }
      if (type === 'SMS_Opt_In__c') {
        const sms = state.data.form.calcs.sms.sms_opt_in;
        return sms && sms == 'yes' ? true : sms && sms == 'no' ? false : '';
      }
      if (type === 'SMS_Opt_In_II__c') {
        const sms = state.data.form.calcs.sms.sms_opt_in_educational;
        return sms && sms == 'yes' ? true : sms && sms == 'no' ? false : '';
      }
      return null;
    };

    const ref = state.data.form.subcase_0.case.update.brace_type;
    const Brace_Type__c = !ref
      ? state.data.form.brace.brace_type_india
      : ref
      ? state.braceMap[ref]
      : 'Not Defined';

    let contact = {
      // FirstName: state.data.form.calcs.case_properties.patient_first_name,
      // LastName: state.data.form.calcs.case_properties.patient_last_name,
      LastName: state.data.form.calcs.case_properties.patient_id,
      CommCare_Case_ID__c: state.data.form.case['@case_id'],
      Date_of_First_Visit__c: state.dateConverter(
        state.data.form.case.update.date_first_visit
      ),
      Brace_Type__c: Brace_Type__c,
      Send_SMS__c: getSMS(state, 'Send_SMS__c'),
      SMS_Opt_In__c: getSMS(state, 'SMS_Opt_In__c'),
      SMS_Opt_In_II__c: getSMS(state, 'SMS_Opt_In_II__c'),
      SMS_Original_Treatment__c:
        treatmentMap[state.data.form.calcs.sms.original_treatment],
      SMS_Language__c: state.data.form.calcs.sms.sms_language,
      SMS_Timezone__c: state.data.form.calcs.sms.time_zone,
    };

    const { treatment, original_treatment } = state.data.form.calcs.sms;
    if (treatment !== original_treatment) {
      contact = {
        ...contact,
        SMS_Treatment__c: treatmentMap[treatment],
        SMS_Treatment_Start_Date__c: state.data.received_on,
      };
    }

    return upsert(
      'Contact',
      'CommCare_Case_ID__c',
      contact
    )(state).then(state => {
      return upsert(
        'Visit_new__c',
        'New_Visit_UID__c',
        fields(
          field('RecordTypeId', state => {
            var treatment = state.data.form.calcs.sms.treatment;
            return state.RTmap[treatment] || '0123l000001g0XyAAI'; //Return 'Other' if not in RTmap
          }),
          field('New_Visit_UID__c', state => {
            var icrId = state.data.form.subcase_0.case.update.visit_original_id;
            var caseId = state.data.form.subcase_0.case['@case_id'];
            return icrId && icrId !== '' ? icrId : caseId;
          }),
          //changed EXT ID from gciclubfoot__commcare_case_id__c as this is how it is configured in SF
          field(
            'gciclubfootommcare_case_id__c',
            state.data.form.subcase_0.case['@case_id']
          ), //changed from gciclubfoot__commcare_case_id__c as this is how it is configured in SF
          relationship(
            'Patient__r',
            'CommCare_Case_ID__c',
            dataValue('form.case.@case_id')
          ), //Changed from Contact to Patient__r
          field('Visit_Date__c', state => {
            return state.dateConverter(
              state.data.form.subcase_0.case.update.visit_date
            );
          }),
          field('Next_Visit_Date__c', state => {
            return state.dateConverter(
              state.data.form.subcase_0.case.update.next_visit_date
            );
          }),
          field(
            'Brace_Count__c',
            dataValue('form.subcase_0.case.update.brace_count')
          ),
          field(
            'Brace_Problems__c',
            dataValue('form.subcase_0.case.update.brace_problems')
          ), // picklist
          field(
            'Brace_Problems_Notes__c',
            dataValue('form.subcase_0.case.update.brace_problems_specified')
          ),
          field('Brace_Problems_Type__c', state => {
            const typesString =
              state.data.form.brace.brace_problems.brace_problems_type;
            if (typeof typesString === 'string') {
              const types = typesString.split(' ');
              const braceProblems = types.map(
                type => state.braceProblemsTypeMap[type]
              );
              return braceProblems.join(';');
            }
            return typesString;
          }),
          field('brace_problems_picture__c', function (state) {
            return state.handleBracePhoto(state, 'brace_problems_picture');
          }),
          field('Brace_Type__c', state => {
            const ref = state.data.form.subcase_0.case.update.brace_type;
            return !ref
              ? state.data.form.brace.brace_type_india
              : ref
              ? state.braceMap[ref]
              : 'Not Defined';
          }),
          field(
            'Brace_Condition_Non_MiracleFeet_Brace__c',
            humanProper(state.data.form.subcase_0.case.update.brace_condition)
          ), // picklist
          field(
            'Steenbeek_Brace_Size__c',
            humanProper(state.data.form.subcase_0.case.update.steenbeek_size)
          ),
          field(
            'MiracleFeet_Bar_Condition__c',
            humanProper(
              state.data.form.subcase_0.case.update.miraclefeet_bar_condition
            )
          ), // picklist
          field(
            'MiracleFeet_Bar_Size__c',
            humanProper(
              state.data.form.subcase_0.case.update.miraclefeet_bar_size
            )
          ),
          // Field does not exist in SF? FIeld has been created.
          field('Date_of_SMS_Registration_Visit__c', state => {
            var smsDate =
              state.data.form.subcase_0.case.update.date_of_sms_registration;
            return smsDate && smsDate !== undefined
              ? state.dateConverter(smsDate)
              : smsDate;
          }),
          // picklist
          field('MiracleFeet_Shoe_Size__c', state => {
            const mf_shoe =
              state.data.form.subcase_0.case.update.miraclefeet_shoe_size;
            const mf_brace = state.data.form.brace.miraclefeet_brace;
            var shoe = '';
            if (
              typeof mf_brace === 'undefined' &&
              typeof mf_shoe === 'undefined'
            ) {
              shoe = '';
            } else if (
              typeof mf_brace.miraclefeet_shoe_size_india === 'undefined' &&
              typeof mf_shoe === 'undefined'
            ) {
              shoe = '';
            } else if (
              typeof mf_brace.miraclefeet_shoe_size_india === 'undefined'
            ) {
              shoe =
                mf_shoe.charAt(0).toUpperCase() +
                mf_shoe.slice(1).replace('_', ' ');
            } else {
              shoe =
                mf_brace.miraclefeet_shoe_size_india.charAt(0).toUpperCase() +
                mf_brace.miraclefeet_shoe_size_india.slice(1).replace('_', ' ');
            }
            return shoe;
          }),
          field(
            'MiracleFeet_Brace_Given__c',
            humanProper(
              state.data.form.subcase_0.case.update.miraclefeet_brace_given
            )
          ), // picklist
          field(
            'MiracleFeet_Shoes_Condition__c',
            humanProper(
              state.data.form.subcase_0.case.update.miraclefeet_shoes_condition
            )
          ), // picklist
          field(
            'Cast_Count__c',
            dataValue('form.subcase_0.case.update.cast_count')
          ),
          field(
            'Casting_Complications__c',
            dataValue('form.subcase_0.case.update.complications')
          ),
          field('Casting_Complications_Type__c', state => {
            return state.handleMultiSelect(state, 'complication_type');
          }),
          field(
            'Casting_Complications_Notes__c',
            dataValue('form.subcase_0.case.update.complication_type_other')
          ),
          field('Date_Referral_Made__c', state => {
            return state.dateConverter(
              state.data.form.subcase_0.case.update.date_referral_made
            );
          }),
          field('Date_of_Tenotomy__c', state => {
            return state.dateConverter(
              state.data.form.subcase_0.case.update.date_tenotomy
            );
          }),
          field('First_Brace__c', state => {
            return state.data.form.subcase_0.case.update.is_first_brace == '1'
              ? true
              : false; // sf checkbox
          }),
          field('ICR_ID__c', state => {
            var icrId = state.data.form.subcase_0.case.update.visit_original_id;
            var caseId = state.data.form.subcase_0.case['@case_id'];
            return icrId && icrId !== '' ? icrId : caseId;
          }),
          field(
            'Left_Angle_of_Abduction__c',
            dataValue('form.subcase_0.case.update.l_angle_abduction')
          ),
          field(
            'Left_Angle_of_Dorsiflexion__c',
            dataValue('form.subcase_0.case.update.l_angle_dorsiflexion')
          ),
          field(
            'Left_Medial_Crease__c',
            dataValue('form.subcase_0.case.update.l_medial_crease')
          ),
          field(
            'Left_Talar_Head__c',
            dataValue('form.subcase_0.case.update.l_talar_head')
          ),
          field(
            'Left_Curved_Lateral_Border__c',
            dataValue('form.subcase_0.case.update.l_curved_lateral_border')
          ),
          field(
            'Left_Midfoot_Score__c',
            dataValue('form.subcase_0.case.update.l_midfoot_score')
          ),
          field(
            'Left_Posterior_Crease__c',
            dataValue('form.subcase_0.case.update.l_posterior_crease')
          ),
          field(
            'Left_Empty_Heel__c',
            dataValue('form.subcase_0.case.update.l_empty_heel')
          ),
          field(
            'Left_Rigid_Equinus__c',
            dataValue('form.subcase_0.case.update.l_rigid_equinus')
          ),
          field(
            'Left_Hindfoot_Score__c',
            dataValue('form.subcase_0.case.update.l_hindfoot_score')
          ),
          field(
            'Left_Pirani_Total_Score__c',
            dataValue('form.subcase_0.case.update.l_total_score')
          ),
          field(
            'Left_Pirani_Score_Improved__c',
            dataValue('form.subcase_0.case.update.l_score_improved')
          ),
          field(
            'Left_Pirani_Score_Not_Improved__c',
            dataValue('form.subcase_0.case.update.l_score_not_improved')
          ),
          field(
            'Left_Pirani_Score_Same__c',
            dataValue('form.subcase_0.case.update.l_score_same')
          ),
          field(
            'Left_Treatment__c',
            humanProper(state.data.form.subcase_0.case.update.l_treatment)
          ), // picklist
          field(
            'Left_Treatment_Other__c',
            dataValue('form.subcase_0.case.update.l_treatment_other')
          ),
          field(
            'Left_Surgery_Type__c',
            humanProper(state.data.form.subcase_0.case.update.l_surgery_type)
          ), // picklist
          field(
            'Left_Surgery_Type_Other__c',
            dataValue('form.subcase_0.case.update.l_surgery_type_other')
          ),
          field(
            'Right_Angle_of_Abduction__c',
            dataValue('form.subcase_0.case.update.r_angle_abduction')
          ),
          field(
            'Right_Angle_of_Dorsiflexion__c',
            dataValue('form.subcase_0.case.update.r_angle_dorsiflexion')
          ),
          field(
            'Right_Medial_Crease__c',
            dataValue('form.subcase_0.case.update.r_medial_crease')
          ),
          field(
            'Right_Talar_Head__c',
            dataValue('form.subcase_0.case.update.r_talar_head')
          ),
          field(
            'Right_Curved_Lateral_Border__c',
            dataValue('form.subcase_0.case.update.r_curved_lateral_border')
          ),
          field(
            'Right_Midfoot_Score__c',
            dataValue('form.subcase_0.case.update.r_midfoot_score')
          ),
          field(
            'Right_Posterior_Crease__c',
            dataValue('form.subcase_0.case.update.r_posterior_crease')
          ),
          field(
            'Right_Empty_Heel__c',
            dataValue('form.subcase_0.case.update.r_empty_heel')
          ),
          field(
            'Right_Rigid_Equinus__c',
            dataValue('form.subcase_0.case.update.r_rigid_equinus')
          ),
          field(
            'Right_Hindfoot_Score__c',
            dataValue('form.subcase_0.case.update.r_hindfoot_score')
          ),
          field(
            'Right_Total_Pirani_Score__c',
            dataValue('form.subcase_0.case.update.r_total_score')
          ),
          field(
            'Right_Pirani_Score_Improved__c',
            dataValue('form.subcase_0.case.update.r_score_improved')
          ),
          field(
            'Right_Pirani_Score_Not_Improved__c',
            dataValue('form.subcase_0.case.update.r_score_not_improved')
          ),
          field(
            'Right_Pirani_Score_Same__c',
            dataValue('form.subcase_0.case.update.r_score_same')
          ),
          field(
            'Right_Treatment__c',
            humanProper(state.data.form.subcase_0.case.update.r_treatment)
          ), // picklist
          field(
            'Right_Treatment_Other__c',
            dataValue('form.subcase_0.case.update.r_treatment_other')
          ),
          field(
            'Right_Surgery_Type__c',
            humanProper(state.data.form.subcase_0.case.update.r_surgery_type)
          ),
          field(
            'Right_Surgery_Type_Other__c',
            dataValue('form.subcase_0.case.update.r_surgery_type_other')
          ),
          field(
            'New_Brace__c',
            dataValue('form.subcase_0.case.update.is_new_brace')
          ),
          field(
            'Bracing_Stage__c',
            dataValue('form.subcase_0.case.update.bracing_stage')
          ),
          field('Opened_Date_CommCare__c', state => {
            const validDate = state.data.form.subcase_0.case['@date_modified'];
            return state.dateConverter(validDate);
          }),

          field('Remote_Visit__c', state => {
            var type = dataValue('form.subcase_0.case.update.visit_type')(
              state
            ); // if visit type is on_site, needs to check box in salesforce
            return type === 'remote' ? true : false;
          }),
          field('Home_exercise_program__c', state => {
            // this is a multiselect
            return state.handleMultiSelect(
              state,
              'home_exercise_programs_advised'
            );
          }),

          field('Instruction_or_advice__c', state => {
            // this is a multiselect
            const advice = state.handleMultiSelectFirstCap(
              state,
              'instruction_advice_given'
            );
            var advice2 = '';
            if (advice === 'Cast_caremaintenance') {
              advice2 = 'Cast care maintenance';
            } else if (advice == 'Pre-treatment_advice_and_education') {
              advice2 = 'Pre-treatment advice and education';
            } else {
              advice2 =
                advice.charAt(0).toUpperCase() +
                advice.slice(1).replace('_', ' ');
            }
            return advice2;
          }),

          //Relapse questions ==========================================================
          field(
            'Relapse__c',
            humanProper(state.data.form.subcase_0.case.update.recurrence)
          ), // picklist
          field(
            'Relapse_Count__c',
            dataValue('form.subcase_0.case.update.recurrence_count')
          ),
          field(
            'Relapse_Feet_Affected__c',
            humanProper(
              state.data.form.subcase_0.case.update.recurrence_feet_affected
            )
          ), // picklist
          field('Relapse_Type_Left__c', state => {
            return state.handleMultiSelect(state, 'recurrence_type_left');
          }),
          field('Relapse_Type_Right__c', state => {
            return state.handleMultiSelect(state, 'recurrence_type_right');
          }),

          field('Relapse_signs_symptoms__c', state => {
            // this is a multiselect
            return state.handleMultiSelect(state, 'symptoms_of_relapse');
          }),
          field('Relapse_Reason__c', state => {
            var reason = dataValue(
              'form.subcase_0.case.update.why_did_relapse_occur'
            )(state); // this is a picklist
            return reason
              ? reason.charAt(0).toUpperCase() +
                  reason.slice(1).replace('_', ' ')
              : '';
          }),
          field('Relapse_Action_Taken__c', state => {
            // this is a multiselect
            return state.handleMultiSelect(state, 'action_taken_relapse');
          }),
          // ===========================================================================

          // Referral Questions ========================================================
          field('Date_Referral_Made__c', state => {
            return state.dateConverter(
              state.data.form.subcase_0.case.update.date_referral_made
            );
          }),
          field(
            'Referral_Hospital__c',
            dataValue('form.subcase_0.case.update.referral_hospital')
          ),
          field(
            'Referral_Provider__c',
            dataValue('form.subcase_0.case.update.referral_provider')
          ),
          field(
            'Referral_Surgery_Type__c',
            humanProper(
              state.data.form.subcase_0.case.update.referral_surgery_type
            )
          ), // picklist
          field(
            'Referral_Surgery_Type_Other__c',
            dataValue('form.subcase_0.case.update.referral_surgery_type_other')
          ),
          field('Referral_Treatment_Date__c', state => {
            return state.dateConverter(
              state.data.form.subcase_0.case.referral_treatment_date
            );
          }),
          field(
            'Referral_Type__c',
            humanProper(state.data.form.subcase_0.case.update.referral_type)
          ), // picklist
          field(
            'Referral_Advanced_Care_Specified__c',
            dataValue('form.subcase_0.case.update.referral_advanced_care')
          ),
          // ===========================================================================

          // Tenotomy Questions ========================================================
          field('Date_of_Tenotomy__c', state => {
            return state.dateConverter(
              state.data.form.subcase_0.case.update.date_tenotomy
            );
          }),
          field(
            'Tenotomy_Given__c',
            humanProper(state.data.form.subcase_0.case.update.tenotomy_given)
          ), // picklist
          field(
            'Tenotomy_Hospital__c',
            dataValue('form.subcase_0.case.update.tenotomy_hospital')
          ),
          field(
            'Tenotomy_Provider__c',
            dataValue('form.subcase_0.case.update.tenotomy_provider')
          ),
          // ===========================================================================

          field('Treatment_Completed__c', state => {
            return state.data.form.subcase_0.case.update.treatment_completed ==
              '1'
              ? true
              : false; // sf checkbox
          }),
          field(
            'Visit_Count__c',
            dataValue('form.subcase_0.case.update.visit_count')
          ),
          field('Name', state => {
            return (
              ' (' +
              state.data.form.subcase_0.case.update.patient_id +
              ') (' +
              state.data.form.subcase_0.case.update.visit_date +
              ')'
            );
          }),
          field(
            'Visit_Notes__c',
            dataValue('form.subcase_0.case.update.visit_notes')
          ),
          field(
            'Treatment_Provider__c',
            dataValue('form.subcase_0.case.update.treatment_provider')
          ),
          field('Photo_1_URL__c', function (state) {
            return state.handlePhoto(state, 'photo_1');
          }),
          field('Photo_2_URL__c', function (state) {
            return state.handlePhoto(state, 'photo_2');
          }),
          field('Photo_3_URL__c', function (state) {
            return state.handlePhoto(state, 'photo_3');
          })
        )
      )(state);
    });
  }
});
