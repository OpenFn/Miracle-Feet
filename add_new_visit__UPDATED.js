//New job for upserting Visits post SF migration
alterState(state => {
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

  const discardedClinics = [
    'test_bangladesh',
    'bol_test',
    'brazil_test',
    'cam_test',
    'brazzaville_test',
    'ecu_test',
    'guat_test',
    'guinea_test_clinic',
    'hon_test',
    'uptest',
    'indonesia_test',
    'test',
    'majunga_test_clinic',
    'morocco_test',
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
    'TestMAJ01', //another?
    'senegal_test_clinic', //another
    'uganda_test_clinic', //another
    'mali_test'  //another
  ];

  state.dateConverter = function (state, dateString) {
    return dateString ? new Date(dateString).toISOString() : null;
  };

  return { ...state, discardedClinics };
});

alterState(state => {
  const { clinic_code } = state.data.form.calcs.case_properties;
  if (state.discardedClinics.includes(clinic_code)) {
    console.log(
      'This is a CommCare test clinic. Not uploading data to Salesforce.'
    );
    return state;
  } else {
    return upsert(
      'Visit_new__c',
      'gciclubfootommcare_case_id__c',
      fields(
        //changed EXT ID from gciclubfoot__commcare_case_id__c as this is how it is configured in SF
        field(
          'gciclubfootommcare_case_id__c',
          dataValue('form.subcase_0.case.@case_id')
        ), //changed from gciclubfoot__commcare_case_id__c as this is how it is configured in SF
        relationship(
          'Patient__r',
          'CommCare_Case_ID__c',
          dataValue('form.case.@case_id')
        ), //Changed from Contact to Patient__r
        field('Visit_Date__c', state => {
          return state.dateConverter(
            state,
            state.data.form.subcase_0.case.update.visit_date
          );
        }),
        field('Next_Visit_Date__c', state => {
          return state.dateConverter(
            state,
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
          return state.handleMultiSelect(state, 'brace_problems_type');
        }),
        field('Brace_Type__c', state => {
          const ref = state.data.form.subcase_0.case.update.brace_type;
          var bracetype = '';
          if (ref == undefined) {
            bracetype = state.data.form.brace.brace_type_india;
          } else if (ref == 'dobbs_or_mitchell') {
            bracetype = 'Dobbs or Mitchell';
          } else if (ref == 'iowa') {
            bracetype = 'Iowa';
          } else if (ref == 'miraclefeet') {
            bracetype = 'MiracleFeet';
          } else if (ref == 'steenbeek') {
            bracetype = 'Steenbeek';
          } else if (ref == 'other') {
            bracetype = 'Other';
          } else {
            bracetype = 'Not Defined';
          }
          return bracetype;
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
        ), // picklist
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
            state,
            state.data.form.subcase_0.case.update.date_referral_made
          );
        }),
        field('Date_of_Tenotomy__c', state => {
          return state.dateConverter(
            state,
            state.data.form.subcase_0.case.update.date_tenotomy
          );
        }),
        field('First_Brace__c', state => {
          return state.data.form.subcase_0.case.update.is_first_brace == '1'
            ? true
            : false; // sf checkbox
        }),
        field(
          'ICR_ID__c',
          dataValue('form.subcase_0.case.update.visit_original_id')
        ),
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
          return state.dateConverter(state, validDate);
        }),

        field('Remote_Visit__c', state => {
          var type = dataValue('form.subcase_0.case.update.visit_type')(state); // if visit type is on_site, needs to check box in salesforce
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
            ? reason.charAt(0).toUpperCase() + reason.slice(1).replace('_', ' ')
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
            state,
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
            state,
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
            state,
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
            state.data.form.subcase_0.case.update.patient_name +
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
  }
});
