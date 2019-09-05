// =============================================================================
// Upsert Visit records in Salesforce when "Visit" cases are updated in CC.
// =============================================================================
alterState((state) => {
  state.handleMultiSelect = function(state, multiField) {
    const ms = state.data.properties[`${multiField}`]
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  };

  return state
});

upsertIf(
  state.data.date_modified != state.data.properties.date_opened + "000Z",
  "Visit_new__c", "gciclubfootommcare_case_id__c", fields(
    field('gciclubfoot__commcare_case_id__c', dataValue('case_id')),
    // relationship('Hospital__r', "uuid__c", dataValue('properties.hospital_code')),
    relationship('Contact', "CommCare_Case_ID__c", dataValue('indices.parent.case_id')),
    field('Visit_Date__c', (state) => {
      const validDate = state.data.properties.visit_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
     field('Next_Visit_Date__c', (state) => {
      const validDate = state.data.properties.next_visit_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),

    //Brace Questions ==========================================================
    field('Brace_Count__c', dataValue('properties.brace_count')),
    field('Brace_Problems__c', humanProper(state.data.properties.brace_problems)), // picklist
    field('Brace_Problems_Notes__c', dataValue('properties.brace_problems_specified')),
    field('Brace_Problems_Type__c', (state) => {
      return state.handleMultiSelect(state, "brace_problems_type")
    }),
    field('Brace_Type__c', (state) => {
      const ref = state.data.properties
      return ( ref.brace_type ? ref.brace_type_india : ref.brace_type );
    }),
    field('Brace_Condition_Non_MiracleFeet_Brace__c', humanProper(state.data.properties.brace_condition)), // picklist
    field('MiracleFeet_Bar_Condition__c', humanProper(state.data.properties.miraclefeet_bar_condition)), // picklist
    field('MiracleFeet_Bar_Size__c', humanProper(state.data.properties.miraclefeet_bar_size)), // picklist
    field('MiracleFeet_Shoe_Size__c', (state) => {
      const form = state.data.properties
      return ( form.miraclefeet_shoe_size ? form.miraclefeet_shoe_size_india : form.miraclefeet_shoe_size );
    }),
    field('MiracleFeet_Brace_Given__c', humanProper(state.data.properties.miraclefeet_brace_given)), // picklist
    field('MiracleFeet_Shoes_Condition__c', humanProper(state.data.properties.miraclefeet_shoes_condition)), // picklist
    field('Case_Closed_by_Username__c', humanProper(state.data.properties.closed_by_username)), // picklist
    field('Case_Closed__c', (state) => {
      return (state.data.properties.closed == "1" ? true : false) // sf checkbox
    }),
    field('Case_Closed_Date__c', (state) => {
      const validDate = state.data.properties.date_closed
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Cast_Count__c', dataValue('properties.cast_count')),
    field('Casting_Complications_Type__c', (state) => {
      return state.handleMultiSelect(state, "complication_type")
    }),
    field('Casting_Complications_Notes__c', dataValue('properties.complication_type_other')),
    field('Date_Referral_Made__c', (state) => {
      const validDate = state.data.properties.date_referral_made
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Date_of_Tenotomy__c', (state) => {
      const validDate = state.data.properties.date_tenotomy
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('First_Brace__c', (state) => {
      return (state.data.properties.is_first_brace == "1" ? true : false) // sf checkbox
    }),
    field('ICR_ID__c', dataValue('properties.visit_original_id')),
    field('Last_Modified_By_Username_CommCare__c', dataValue('last_modified_by_user_username')),
    field('Last_Modified_Date_CommCare__c', (state) => {
      const validDate = state.data.date_modified
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Left_Angle_of_Abduction__c', dataValue('properties.l_angle_abduction')),
    field('Left_Angle_of_Dorsiflexion__c', dataValue('properties.l_angle_dorsiflexion')),
    field('Left_Medial_Crease__c', dataValue('properties.l_medial_crease')),
    field('Left_Talar_Head__c', dataValue('properties.l_talar_head')),
    field('Left_Curved_Lateral_Border__c', dataValue('properties.l_curved_lateral_border')),
    field('Left_Midfoot_Score__c', dataValue('properties.l_midfoot_score')),
    field('Left_Posterior_Crease__c', dataValue('properties.l_posterior_crease')),
    field('Left_Empty_Heel__c', dataValue('properties.l_empty_heel')),
    field('Left_Rigid_Equinus__c', dataValue('properties.l_rigid_equinus')),
    field('Left_Hindfoot_Score__c', dataValue('properties.l_hindfoot_score')),
    field('Left_Pirani_Total_Score__c', dataValue('properties.l_total_score')),
    field('Left_Pirani_Score_Improved__c', dataValue('properties.l_score_improved')),
    field('Left_Pirani_Score_Not_Improved__c', dataValue('properties.l_score_not_improved')),
    field('Left_Pirani_Score_Same__c', dataValue('properties.l_score_same')),
    field('Left_Treatment__c', humanProper(state.data.properties.l_treatment)), // picklist
    field('Left_Treatment_Other__c', dataValue('properties.l_treatment_other')),
    field('Left_Surgery_Type__c', humanProper(state.data.properties.l_surgery_type)), // picklist
    field('Left_Surgery_Type_Other__c', dataValue('properties.l_surgery_type_other')),
    field('Right_Angle_of_Abduction__c', dataValue('properties.r_angle_abduction')),
    field('Right_Angle_of_Dorsiflexion__c', dataValue('properties.r_angle_dorsiflexion')),
    field('Right_Medial_Crease__c', dataValue('properties.r_medial_crease')),
    field('Right_Talar_Head__c', dataValue('properties.r_talar_head')),
    field('Right_Curved_Lateral_Border__c', dataValue('properties.r_curved_lateral_border')),
    field('Right_Midfoot_Score__c', dataValue('properties.r_midfoot_score')),
    field('Right_Posterior_Crease__c', dataValue('properties.r_posterior_crease')),
    field('Right_Empty_Heel__c', dataValue('properties.r_empty_heel')),
    field('Right_Rigid_Equinus__c', dataValue('properties.r_rigid_equinus')),
    field('Right_Hindfoot_Score__c', dataValue('properties.r_hindfoot_score')),
    field('Right_Total_Pirani_Score__c', dataValue('properties.r_total_score')),
    field('Right_Pirani_Score_Improved__c', dataValue('properties.r_score_improved')),
    field('Right_Pirani_Score_Not_Improved__c', dataValue('properties.r_score_not_improved')),
    field('Right_Pirani_Score_Same__c', dataValue('properties.r_score_same')),
    field('Right_Treatment__c', humanProper(state.data.properties.r_treatment)), // picklist
    field('Right_Treatment_Other__c', dataValue('properties.r_treatment_other')),
    field('Right_Surgery_Type__c', humanProper(state.data.properties.r_surgery_type)),
    field('Right_Surgery_Type_Other__c', dataValue('properties.r_surgery_type_other')),
    field('New_Brace__c', dataValue('properties.is_new_brace')),
    field('Next_Visit_Date__c', (state) => {
      const validDate = state.data.properties.next_visit_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Opened_By_Username_CommCare__c', dataValue('properties.opened_by_username')),
    field('Opened_Date_CommCare__c', (state) => {
      const validDate = state.data.properties.date_opened
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Owner_Name_CommCare__c', dataValue('properties.owner_name')),

    //Relapse questions ========================================================
    field('Relapse__c', humanProper(state.data.properties.recurrence)), // picklist
    field('Relapse_Count__c', dataValue('properties.recurrence_count')),
    field('Relapse_Feet_Affected__c', humanProper(state.data.properties.recurrence_feet_affected)), // picklist
    field('Relapse_Type_Left__c', (state) => {
      return state.handleMultiSelect(state, "recurrence_type_left")
    }),
    field('Relapse_Type_Right__c', (state) => {
      return state.handleMultiSelect(state, "recurrence_type_right")
    }),
    // =========================================================================

    //Referral Questions =======================================================
     field('Date_Referral_Made__c', (state) => {
      const validDate = state.data.properties.date_referral_made
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Referral_Hospital__c', dataValue('properties.referral_hospital')),
    field('Referral_Provider__c', dataValue('properties.referral_provider')),
    field('Referral_Surgery_Type__c', humanProper(state.data.properties.referral_surgery_type)), // picklist
    field('Referral_Surgery_Type_Other__c', dataValue('properties.referral_surgery_type_other')),
    field('Referral_Treatment_Date__c', (state) => {
      const validDate = state.data.properties.referral_treatment_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Referral_Type__c', humanProper(state.data.properties.referral_type)), // picklist
    field('Referral_Advanced_Care_Specified__c', dataValue('properties.referral_advanced_care')),
    // =========================================================================

    //Tenotomy Questions =======================================================
    field('Date_of_Tenotomy__c', (state) => {
      const validDate = state.data.properties.date_tenotomy
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Tenotomy_Given__c', humanProper(state.data.properties.tenotomy_given)), // picklist
    field('Tenotomy_Hospital__c', dataValue('properties.tenotomy_hospital')),
    field('Tenotomy_Provider__c', dataValue('properties.tenotomy_provider')),
    // =========================================================================

    field('Treatment_Completed__c', (state) => {
      return (state.data.properties.treatment_completed == "1" ? true : false) // sf checkbox
    }),
    field('Visit_Count__c', dataValue('properties.visit_count')),
    field('Name', (state) => {
      return state.data.properties.patient_name + "/" +
      state.data.properties.patient_id + "/" +
      state.data.properties.visit_count
    }),
    field('Visit_Notes__c', dataValue('properties.visit_notes')),
    field('Treatment_Provider__c', dataValue('properties.treatment_provider'))
  )
);