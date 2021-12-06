// =============================================================================
// New job for SF migratio to new objects
// Upsert Visit records in Salesforce when "Visit" cases are updated in CC.
// =============================================================================
alterState(state => {
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

  state.handleMultiSelectFirstCap = function (state, multiField) {
    const ms = state.data.properties[`${multiField}`];
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

  const discardedClinics = [
    'test_bangladesh',
    'bol_test',
    'brazil_test',
    'cam_test',
    'bong_test',
    'brazzaville_test',
    'ecu_test',
    'Facorc_test',
    'FCRC',
    'gambia_test',
    'gambia_test_clinic',
    'guat_test',
    'guinea_test_clinic',
    'hon_test',
    'uptest',
    'indonesia_test',
    'test',
    'majunga_test_clinic',
    'madagascar_test',
    'morocco_test',
    'morocco_test_clinic',
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
    'sierra_leone_test_clinic',
    'haiti_test_clinic'
  ];

  state.dateConverter = function (state, dateString) {
    return dateString ? new Date(dateString).toISOString() : null;
  };

  return { ...state, discardedClinics, braceMap };
});

alterState(state => {
  const { clinic_code, patient_id } = state.data.properties;
  if (state.discardedClinics.includes(clinic_code)) {
    console.log(
      'This is a CommCare test clinic. Not uploading data to Salesforce.'
    );
    return state;
  } else if (patient_id.startsWith('IND')) {
    console.log('Salesforce update skipped for historical India case.');
    return state;
  } else {
    return upsert(
      'Contact',
      'CommCare_Case_ID__c',
      fields(
        field('FirstName', dataValue('properties.patient_first_name')),
        field('LastName', state => {
          var name1 = dataValue('properties.patient_last_name')(state);
          var name2 = dataValue('properties.patient_name')(state);
          return name1 ? name1 : name2; 
        }),
        field(
          'CommCare_Case_ID__c',
          dataValue('indices.parent.case_id') 
          //dataValue('case_id') //this is appoint case_id, not patient... did something change in CommCare? 
        ),
        field('Brace_Type__c', state => {
          const ref = state.data.properties.brace_type;
          return !ref
            ? state.data.properties.brace_type_india
            : ref
            ? state.braceMap[ref]
            : 'Not Defined';
        })
      )
    )(state).then(state => {
      return upsertIf(
        state.data.date_modified != state.data.properties.date_opened + '000Z',
        'Visit_new__c',
        'New_Visit_UID__c',
        fields(
          field('New_Visit_UID__c', state => {
            var icrId = dataValue('properties.visit_original_id')(state);
            var caseId = dataValue('case_id')(state);
            return icrId && icrId !== '' ? icrId : caseId;
          }),
          field('gciclubfootommcare_case_id__c', dataValue('case_id')), //changed from gciclubfoot__commcare_case_id__c
          // relationship('Hospital__r', "uuid__c", dataValue('properties.hospital_code')),
          relationship(
            'Patient__r',
            'CommCare_Case_ID__c',
            dataValue('indices.parent.case_id')
          ), //changed from Contact to Patient__r
          field('Visit_Date__c', state => {
            return state.dateConverter(state, state.data.properties.visit_date);
          }),
          field('Next_Visit_Date__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.next_visit_date
            );
          }),
          //Brace Questions ==========================================================
          field('Brace_Count__c', dataValue('properties.brace_count')),
          field(
            'Brace_Problems__c',
            humanProper(state.data.properties.brace_problems)
          ), // picklist
          field(
            'Brace_Problems_Notes__c',
            dataValue('properties.brace_problems_specified')
          ),
          field('Brace_Problems_Type__c', state => {
            return state.handleMultiSelect(state, 'brace_problems_type');
          }),
          field('Brace_Type__c', state => {
            const ref = state.data.properties.brace_type;
            return !ref
              ? state.data.properties.brace_type_india
              : ref
              ? state.braceMap[ref]
              : 'Not Defined';
          }),
          field(
            'Brace_Condition_Non_MiracleFeet_Brace__c',
            humanProper(state.data.properties.brace_condition)
          ), // picklist
          field(
            'MiracleFeet_Bar_Condition__c',
            humanProper(state.data.properties.miraclefeet_bar_condition)
          ), // picklist
          field(
            'MiracleFeet_Bar_Size__c',
            humanProper(state.data.properties.miraclefeet_bar_size)
          ), // picklist
          field('MiracleFeet_Shoe_Size__c', state => {
            const mf_shoe = state.data.properties.miraclefeet_shoe_size;
            var shoe = '';
            if (mf_shoe == undefined) {
              shoe = '';
            } else {
              shoe =
                mf_shoe.charAt(0).toUpperCase() +
                mf_shoe.slice(1).replace('_', ' ');
            }
            return shoe;
          }),
          field(
            'MiracleFeet_Brace_Given__c',
            humanProper(state.data.properties.miraclefeet_brace_given)
          ), // picklist
          field(
            'MiracleFeet_Shoes_Condition__c',
            humanProper(state.data.properties.miraclefeet_shoes_condition)
          ), // picklist
          field('Case_Closed__c', state => {
            return state.data.properties.closed == '1' ? true : false; // sf checkbox
          }),
          field('Case_Closed_Date__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.date_closed
            );
          }),
          field('Cast_Count__c', dataValue('properties.cast_count')),
          field('Casting_Complications_Type__c', state => {
            return state.handleMultiSelect(state, 'complication_type');
          }),
          field(
            'Casting_Complications_Notes__c',
            dataValue('properties.complication_type_other')
          ),
          field('Date_Referral_Made__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.date_referral_made
            );
          }),
          field('Date_of_Tenotomy__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.date_tenotomy
            );
          }),
          field('First_Brace__c', state => {
            return state.data.properties.is_first_brace == '1' ? true : false; // sf checkbox
          }),
          field('ICR_ID__c', state => {
            var icrId = dataValue('properties.visit_original_id')(state);
            var caseId = dataValue('case_id')(state);
            return icrId && icrId !== '' ? icrId : caseId;
          }),
          field(
            'Last_Modified_By_Username_CommCare__c',
            dataValue('last_modified_by_user_username')
          ),
          field('Last_Modified_Date_CommCare__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.date_modified
            );
          }),
          field(
            'Left_Angle_of_Abduction__c',
            dataValue('properties.l_angle_abduction')
          ),
          field(
            'Left_Angle_of_Dorsiflexion__c',
            dataValue('properties.l_angle_dorsiflexion')
          ),
          field(
            'Left_Medial_Crease__c',
            dataValue('properties.l_medial_crease')
          ),
          field('Left_Talar_Head__c', dataValue('properties.l_talar_head')),
          field(
            'Left_Curved_Lateral_Border__c',
            dataValue('properties.l_curved_lateral_border')
          ),
          field(
            'Left_Midfoot_Score__c',
            dataValue('properties.l_midfoot_score')
          ),
          field(
            'Left_Posterior_Crease__c',
            dataValue('properties.l_posterior_crease')
          ),
          field('Left_Empty_Heel__c', dataValue('properties.l_empty_heel')),
          field(
            'Left_Rigid_Equinus__c',
            dataValue('properties.l_rigid_equinus')
          ),
          field(
            'Left_Hindfoot_Score__c',
            dataValue('properties.l_hindfoot_score')
          ),
          field(
            'Left_Pirani_Total_Score__c',
            dataValue('properties.l_total_score')
          ),
          field(
            'Left_Pirani_Score_Improved__c',
            dataValue('properties.l_score_improved')
          ),
          field(
            'Left_Pirani_Score_Not_Improved__c',
            dataValue('properties.l_score_not_improved')
          ),
          field(
            'Left_Pirani_Score_Same__c',
            dataValue('properties.l_score_same')
          ),
          field(
            'Left_Treatment__c',
            humanProper(state.data.properties.l_treatment)
          ), // picklist
          field(
            'Left_Treatment_Other__c',
            dataValue('properties.l_treatment_other')
          ),
          field(
            'Left_Surgery_Type__c',
            humanProper(state.data.properties.l_surgery_type)
          ), // picklist
          field(
            'Left_Surgery_Type_Other__c',
            dataValue('properties.l_surgery_type_other')
          ),
          field(
            'Right_Angle_of_Abduction__c',
            dataValue('properties.r_angle_abduction')
          ),
          field(
            'Right_Angle_of_Dorsiflexion__c',
            dataValue('properties.r_angle_dorsiflexion')
          ),
          field(
            'Right_Medial_Crease__c',
            dataValue('properties.r_medial_crease')
          ),
          field('Right_Talar_Head__c', dataValue('properties.r_talar_head')),
          field(
            'Right_Curved_Lateral_Border__c',
            dataValue('properties.r_curved_lateral_border')
          ),
          field(
            'Right_Midfoot_Score__c',
            dataValue('properties.r_midfoot_score')
          ),
          field(
            'Right_Posterior_Crease__c',
            dataValue('properties.r_posterior_crease')
          ),
          field('Right_Empty_Heel__c', dataValue('properties.r_empty_heel')),
          field(
            'Right_Rigid_Equinus__c',
            dataValue('properties.r_rigid_equinus')
          ),
          field(
            'Right_Hindfoot_Score__c',
            dataValue('properties.r_hindfoot_score')
          ),
          field(
            'Right_Total_Pirani_Score__c',
            dataValue('properties.r_total_score')
          ),
          field(
            'Right_Pirani_Score_Improved__c',
            dataValue('properties.r_score_improved')
          ),
          field(
            'Right_Pirani_Score_Not_Improved__c',
            dataValue('properties.r_score_not_improved')
          ),
          field(
            'Right_Pirani_Score_Same__c',
            dataValue('properties.r_score_same')
          ),
          field(
            'Right_Treatment__c',
            humanProper(state.data.properties.r_treatment)
          ), // picklist
          field(
            'Right_Treatment_Other__c',
            dataValue('properties.r_treatment_other')
          ),
          field(
            'Right_Surgery_Type__c',
            humanProper(state.data.properties.r_surgery_type)
          ),
          field(
            'Right_Surgery_Type_Other__c',
            dataValue('properties.r_surgery_type_other')
          ),
          field('New_Brace__c', dataValue('properties.is_new_brace')),
          field('Opened_Date_CommCare__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.date_opened
            );
          }),
          field('Owner_Name_CommCare__c', dataValue('properties.owner_name')),

          field('Remote_Visit__c', state => {
            var type = dataValue('properties.visit_type')(state); // if visit type is on_site, needs to check box in salesforce
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

          //Relapse questions ========================================================
          field('Relapse__c', humanProper(state.data.properties.recurrence)), // picklist
          field('Relapse_Count__c', dataValue('properties.recurrence_count')),
          field(
            'Relapse_Feet_Affected__c',
            humanProper(state.data.properties.recurrence_feet_affected)
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
            var reason = dataValue('properties.why_did_relapse_occur')(state); // this is a picklist
            return reason
              ? reason.charAt(0).toUpperCase() +
                  reason.slice(1).replace('_', ' ')
              : '';
          }),
          field('Relapse_Action_Taken__c', state => {
            // this is a multiselect
            return state.handleMultiSelect(state, 'action_taken_relapse');
          }),
          // =========================================================================

          //Referral Questions =======================================================
          field('Date_Referral_Made__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.date_referral_made
            );
          }),
          field(
            'Referral_Hospital__c',
            dataValue('properties.referral_hospital')
          ),
          field(
            'Referral_Provider__c',
            dataValue('properties.referral_provider')
          ),
          field(
            'Referral_Surgery_Type__c',
            humanProper(state.data.properties.referral_surgery_type)
          ), // picklist
          field(
            'Referral_Surgery_Type_Other__c',
            dataValue('properties.referral_surgery_type_other')
          ),
          field('Referral_Treatment_Date__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.referral_treatment_date
            );
          }),
          field(
            'Referral_Type__c',
            humanProper(state.data.properties.referral_type)
          ), // picklist
          field(
            'Referral_Advanced_Care_Specified__c',
            dataValue('properties.referral_advanced_care')
          ),
          // =========================================================================

          //Tenotomy Questions =======================================================
          field('Date_of_Tenotomy__c', state => {
            return state.dateConverter(
              state,
              state.data.properties.date_tenotomy
            );
          }),
          field(
            'Tenotomy_Given__c',
            humanProper(state.data.properties.tenotomy_given)
          ), // picklist
          field(
            'Tenotomy_Hospital__c',
            dataValue('properties.tenotomy_hospital')
          ),
          field(
            'Tenotomy_Provider__c',
            dataValue('properties.tenotomy_provider')
          ),
          // =========================================================================

          field('Treatment_Completed__c', state => {
            return state.data.properties.treatment_completed == '1'
              ? true
              : false; // sf checkbox
          }),
          field('Visit_Count__c', dataValue('properties.visit_count')),
          field('Name', state => {
            return (
              state.data.properties.patient_name +
              ' (' +
              state.data.properties.patient_id +
              ')' + '(' +
              state.data.properties.visit_date +
              ')'
            );
          }),
          field('Visit_Notes__c', dataValue('properties.visit_notes')),
          field(
            'Treatment_Provider__c',
            dataValue('properties.treatment_provider')
          )
        )
      )(state);
    });
  }
});
