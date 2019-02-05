// =============================================================================
// Upsert Visit records in Salesforce when "Visit" cases are updated in CC.
// Example Note
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
  "gciclubfoot__Visit__c", "gciclubfoot__commcare_case_id__c", fields(
    field('gciclubfoot__commcare_case_id__c', dataValue('case_id')),
    // relationship('Hospital__r', "uuid__c", dataValue('properties.hospital_code')),
    relationship('gciclubfoot__Patient__r', "gciclubfoot__CommCare_Case_ID__c", dataValue('indices.parent.case_id')),
    field('gciclubfoot__Visit_Date__c', (state) => {
      const validDate = state.data.properties.visit_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
     field('gciclubfoot__Next_Visit_Date__c', (state) => {
      const validDate = state.data.properties.next_visit_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),

    //Brace Questions ==========================================================
    field('gciclubfoot__Brace_Count__c', dataValue('properties.brace_count')),
    field('gciclubfoot__Brace_Problems__c', humanProper(state.data.properties.brace_problems)), // picklist
    field('gciclubfoot__Brace_Problems_Notes__c', dataValue('properties.brace_problems_specified')),
    field('gciclubfoot__Brace_Problems_Type__c', (state) => {
      return state.handleMultiSelect(state, "brace_problems_type")
    }),
    field('gciclubfoot__Brace_Type__c', (state) => {
      const ref = state.data.properties
      return ( ref.brace_type ? ref.brace_type_india : ref.brace_type );
    }),
    field('gciclubfoot__Brace_Condition_Non_MiracleFeet_Brace__c', humanProper(state.data.properties.brace_condition)), // picklist
    field('gciclubfoot__MiracleFeet_Bar_Condition__c', humanProper(state.data.properties.miraclefeet_bar_condition)), // picklist
    field('gciclubfoot__MiracleFeet_Bar_Size__c', humanProper(state.data.properties.miraclefeet_bar_size)), // picklist
    field('gciclubfoot__MiracleFeet_Shoe_Size__c', (state) => {
      const form = state.data.properties
      return ( form.miraclefeet_shoe_size ? form.miraclefeet_shoe_size_india : form.miraclefeet_shoe_size );
    }),
    field('gciclubfoot__MiracleFeet_Brace_Given__c', humanProper(state.data.properties.miraclefeet_brace_given)), // picklist
    field('gciclubfoot__MiracleFeet_Shoes_Condition__c', humanProper(state.data.properties.miraclefeet_shoes_condition)), // picklist
    field('gciclubfoot__Case_Closed_by_Username__c', humanProper(state.data.properties.closed_by_username)), // picklist
    field('gciclubfoot__Case_Closed__c', (state) => {
      return (state.data.properties.closed == "1" ? true : false) // sf checkbox
    }),
    field('gciclubfoot__Case_Closed_Date__c', (state) => {
      const validDate = state.data.properties.date_closed
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Cast_Count__c', dataValue('properties.cast_count')),
    field('gciclubfoot__Casting_Complications_Type__c', (state) => {
      return state.handleMultiSelect(state, "complication_type")
    }),
    field('gciclubfoot__Casting_Complications_Notes__c', dataValue('properties.complication_type_other')),
    field('gciclubfoot__Date_Referral_Made__c', (state) => {
      const validDate = state.data.properties.date_referral_made
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Date_of_Tenotomy__c', (state) => {
      const validDate = state.data.properties.date_tenotomy
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__First_Brace__c', (state) => {
      return (state.data.properties.is_first_brace == "1" ? true : false) // sf checkbox
    }),
    field('gciclubfoot__ICR_ID__c', dataValue('properties.visit_original_id')),
    field('gciclubfoot__Last_Modified_By_Username_CommCare__c', dataValue('last_modified_by_user_username')),
    field('gciclubfoot__Last_Modified_Date_CommCare__c', (state) => {
      const validDate = state.data.date_modified
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Left_Angle_of_Abduction__c', dataValue('properties.l_angle_abduction')),
    field('gciclubfoot__Left_Angle_of_Dorsiflexion__c', dataValue('properties.l_angle_dorsiflexion')),
    field('gciclubfoot__Left_Medial_Crease__c', dataValue('properties.l_medial_crease')),
    field('gciclubfoot__Left_Talar_Head__c', dataValue('properties.l_talar_head')),
    field('gciclubfoot__Left_Curved_Lateral_Border__c', dataValue('properties.l_curved_lateral_border')),
    field('gciclubfoot__Left_Midfoot_Score__c', dataValue('properties.l_midfoot_score')),
    field('gciclubfoot__Left_Posterior_Crease__c', dataValue('properties.l_posterior_crease')),
    field('gciclubfoot__Left_Empty_Heel__c', dataValue('properties.l_empty_heel')),
    field('gciclubfoot__Left_Rigid_Equinus__c', dataValue('properties.l_rigid_equinus')),
    field('gciclubfoot__Left_Hindfoot_Score__c', dataValue('properties.l_hindfoot_score')),
    field('gciclubfoot__Left_Pirani_Total_Score__c', dataValue('properties.l_total_score')),
    field('gciclubfoot__Left_Pirani_Score_Improved__c', dataValue('properties.l_score_improved')),
    field('gciclubfoot__Left_Pirani_Score_Not_Improved__c', dataValue('properties.l_score_not_improved')),
    field('gciclubfoot__Left_Pirani_Score_Same__c', dataValue('properties.l_score_same')),
    field('gciclubfoot__Left_Treatment__c', humanProper(state.data.properties.l_treatment)), // picklist
    field('gciclubfoot__Left_Treatment_Other__c', dataValue('properties.l_treatment_other')),
    field('gciclubfoot__Left_Surgery_Type__c', humanProper(state.data.properties.l_surgery_type)), // picklist
    field('gciclubfoot__Left_Surgery_Type_Other__c', dataValue('properties.l_surgery_type_other')),
    field('gciclubfoot__Right_Angle_of_Abduction__c', dataValue('properties.r_angle_abduction')),
    field('gciclubfoot__Right_Angle_of_Dorsiflexion__c', dataValue('properties.r_angle_dorsiflexion')),
    field('gciclubfoot__Right_Medial_Crease__c', dataValue('properties.r_medial_crease')),
    field('gciclubfoot__Right_Talar_Head__c', dataValue('properties.r_talar_head')),
    field('gciclubfoot__Right_Curved_Lateral_Border__c', dataValue('properties.r_curved_lateral_border')),
    field('gciclubfoot__Right_Midfoot_Score__c', dataValue('properties.r_midfoot_score')),
    field('gciclubfoot__Right_Posterior_Crease__c', dataValue('properties.r_posterior_crease')),
    field('gciclubfoot__Right_Empty_Heel__c', dataValue('properties.r_empty_heel')),
    field('gciclubfoot__Right_Rigid_Equinus__c', dataValue('properties.r_rigid_equinus')),
    field('gciclubfoot__Right_Hindfoot_Score__c', dataValue('properties.r_hindfoot_score')),
    field('gciclubfoot__Right_Total_Pirani_Score__c', dataValue('properties.r_total_score')),
    field('gciclubfoot__Right_Pirani_Score_Improved__c', dataValue('properties.r_score_improved')),
    field('gciclubfoot__Right_Pirani_Score_Not_Improved__c', dataValue('properties.r_score_not_improved')),
    field('gciclubfoot__Right_Pirani_Score_Same__c', dataValue('properties.r_score_same')),
    field('gciclubfoot__Right_Treatment__c', humanProper(state.data.properties.r_treatment)), // picklist
    field('gciclubfoot__Right_Treatment_Other__c', dataValue('properties.r_treatment_other')),
    field('gciclubfoot__Right_Surgery_Type__c', humanProper(state.data.properties.r_surgery_type)),
    field('gciclubfoot__Right_Surgery_Type_Other__c', dataValue('properties.r_surgery_type_other')),
    field('gciclubfoot__New_Brace__c', dataValue('properties.is_new_brace')),
    field('gciclubfoot__Bracing_Stage__c', dataValue('properties.bracing_stage’)),
    field('gciclubfoot__Next_Visit_Date__c', (state) => {
      const validDate = state.data.properties.next_visit_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Opened_By_Username_CommCare__c', dataValue('properties.opened_by_username')),
    field('gciclubfoot__Opened_Date_CommCare__c', (state) => {
      const validDate = state.data.properties.date_opened
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Owner_Name_CommCare__c', dataValue('properties.owner_name')),

    //Relapse questions ========================================================
    field('gciclubfoot__Relapse__c', humanProper(state.data.properties.recurrence)), // picklist
    field('gciclubfoot__Relapse_Count__c', dataValue('properties.recurrence_count')),
    field('gciclubfoot__Relapse_Feet_Affected__c', humanProper(state.data.properties.recurrence_feet_affected)), // picklist
    field('gciclubfoot__Relapse_Type_Left__c', (state) => {
      return state.handleMultiSelect(state, "recurrence_type_left")
    }),
    field('gciclubfoot__Relapse_Type_Right__c', (state) => {
      return state.handleMultiSelect(state, "recurrence_type_right")
    }),
    // =========================================================================

    //Referral Questions =======================================================
     field('gciclubfoot__Date_Referral_Made__c', (state) => {
      const validDate = state.data.properties.date_referral_made
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Referral_Hospital__c', dataValue('properties.referral_hospital')),
    field('gciclubfoot__Referral_Provider__c', dataValue('properties.referral_provider')),
    field('gciclubfoot__Referral_Surgery_Type__c', humanProper(state.data.properties.referral_surgery_type)), // picklist
    field('gciclubfoot__Referral_Surgery_Type_Other__c', dataValue('properties.referral_surgery_type_other')),
    field('gciclubfoot__Referral_Treatment_Date__c', (state) => {
      const validDate = state.data.properties.referral_treatment_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Referral_Type__c', humanProper(state.data.properties.referral_type)), // picklist
    field('gciclubfoot__Referral_Advanced_Care_Specified__c', dataValue('properties.referral_advanced_care')),
    // =========================================================================

    //Tenotomy Questions =======================================================
    field('gciclubfoot__Date_of_Tenotomy__c', (state) => {
      const validDate = state.data.properties.date_tenotomy
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Tenotomy_Given__c', humanProper(state.data.properties.tenotomy_given)), // picklist
    field('gciclubfoot__Tenotomy_Hospital__c', dataValue('properties.tenotomy_hospital')),
    field('gciclubfoot__Tenotomy_Provider__c', dataValue('properties.tenotomy_provider')),
    // =========================================================================

    field('gciclubfoot__Treatment_Completed__c', (state) => {
      return (state.data.properties.treatment_completed == "1" ? true : false) // sf checkbox
    }),
    field('gciclubfoot__Visit_Count__c', dataValue('properties.visit_count')),
    field('Name', (state) => {
      return state.data.properties.patient_name + "(" +
      state.data.properties.patient_id + ") (" +
      state.data.properties.visit_date + ")"
    }),
    field('gciclubfoot__Visit_Notes__c', dataValue('properties.visit_notes')),
    field('gciclubfoot__Treatment_Provider__c', dataValue('properties.treatment_provider'))
  )
);
