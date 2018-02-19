// =============================================================================
// Upsert Visit records in Salesforce when "Visit" cases are updated in CC.
// =============================================================================
upsert("gciclubfoot__Visit__c", "gciclubfoot__commcare_case_id__c", fields(
  field('gciclubfoot__commcare_case_id__c', dataValue('case_id')),
  // relationship('Hospital__r', "uuid__c", dataValue('properties.hospital_code')),
  // How do we link to the patient? ============================================
  relationship('gciclubfoot__Patient__r', "gciclubfoot__CommCare_Case_ID__c", dataValue('properties.patient_id')),
  field('gciclubfoot__Visit_Date__c', (state) => {
    const validDate = state.data.properties.visit_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Brace_Count__c', dataValue('properties.brace_count')),
  field('gciclubfoot__Brace_Problems__c', dataValue('properties.brace_problems')), //picklist Yes, No
  field('gciclubfoot__Brace_Problems_Notes__c', dataValue('properties.brace_problems_specified')),
  field('gciclubfoot__Brace_Problems_Type__c', dataValue('properties.brace_problems_type')), //MS picklist
  // None
  // Inadequate abduction or dorsiflexion in foot: cannot fit the brace
  // Child not wearing the brace a sufficient amount of time
  // Child not tolerating the brace
  // Brace not acceptable to parents
  // Shoes too big or too small for child
  // Feet slipping out of shoes/heel not flat in shoe
  // Blisters, rash, wound or other skin irritation
  // Broken or defective brace, such as brace bar or shoes broke down
  // Other
  field('gciclubfoot__Case_Closed_by_Username__c', dataValue('properties.closed_by_username')),
  field('gciclubfoot__Case_Closed__c', (state) => {
    return (state.data.properties.closed == "1" ? true : false) // sf checkbox
  }),
  field('gciclubfoot__Case_Closed_Date__c', (state) => {
    const validDate = state.data.properties.closed_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Cast_Count__c', dataValue('properties.cast_count')),
  field('gciclubfoot__Casting_Complications_Type__c', dataValue('properties.complication_type')),//MS picklist None, Cast Slipped, Cast Wet or Broken, Cast Removed, Swelling, Pressure Sore, Rash, Redness, Blisters, Problems with toenails, Other
  field('gciclubfoot__Casting_Complications_Notes__c', dataValue('properties.complication_type_other')),
  field('gciclubfoot__First_Brace__c', (state) => {
    return (state.data.properties.is_first_brace == "1" ? true : false) // sf checkbox
  }),
  field('gciclubfoot__ICR_ID__c', dataValue('properties.visit_original_id')),
  field('gciclubfoot__Last_Modified_By_Username_CommCare__c', dataValue('last_modified_by_user_username')),
  field('gciclubfoot__Last_Modified_Date_CommCare__c', (state) => {
    const validDate = state.data.last_modified_date
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
  field('gciclubfoot__Left_Treatment__c', dataValue('properties.l_treatment')), //picklist Casting, First Brace, Brace Followup, Tenotomy, Surgery, Temporarily Suspend Treatment, Other, None - Treatment Complete
  field('gciclubfoot__Left_Treatment_Other__c', dataValue('properties.l_treatment_other')),
  field('gciclubfoot__Left_Surgery_Type__c', dataValue('properties.l_surgery_type')), //picklist PMR, Tendon Transfer, Corrective Osteotomy, Achilles Tendon Lengthening, Tibialis Anterior Tendon Lengthening, Other
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
  // field('gciclubfoot__Right_Pirani_Total_Score__c', dataValue('properties.r_total_score')),
  field('gciclubfoot__Right_Pirani_Score_Improved__c', dataValue('properties.r_score_improved')),
  field('gciclubfoot__Right_Pirani_Score_Not_Improved__c', dataValue('properties.r_score_not_improved')),
  field('gciclubfoot__Right_Pirani_Score_Same__c', dataValue('properties.r_score_same')),
  field('gciclubfoot__Right_Treatment__c', dataValue('properties.r_reatment')), //picklist Casting, First Brace, Brace Followup, Tenotomy, Surgery, Temporarily Suspend Treatment, Other, None - Treatment Complete
  field('gciclubfoot__Right_Treatment_Other__c', dataValue('properties.r_treatment_other')),
  // field('gciclubfoot__Right_Surgery_Type__c', dataValue('properties.r_surgery_type')), //picklist PMR, Tendon Transfer, Corrective Osteotomy, Achilles Tendon Lengthening, Tibialis Anterior Tendon Lengthening, Other
  field('gciclubfoot__Right_Surgery_Type_Other__c', dataValue('properties.r_surgery_type_other')),
  field('gciclubfoot__New_Brace__c', dataValue('properties.is_new_brace')),
  // field('gciclubfoot__Next_Visit_Date__c', dataValue('properties.next_visit_date')),
  field('gciclubfoot__Opened_By_Username_CommCare__c', dataValue('properties.opened_by_username')),
  field('gciclubfoot__Opened_Date_CommCare__c', (state) => {
    const validDate = state.data.properties.opened_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Owner_Name_CommCare__c', dataValue('properties.owner_name')),
  field('gciclubfoot__Relapse__c', dataValue('properties.recurrence')), //picklist Yes, No
  field('gciclubfoot__Relapse_Count__c', dataValue('properties.recurrence_count')),
  field('gciclubfoot__Treatment_Completed__c', (state) => {
    return (state.data.properties.treatment_completed == "1" ? true : false) // sf checkbox
  }),
  field('gciclubfoot__Visit_Count__c', dataValue('properties.visit_count')),
  field('Name', (state) => {
    // Create a formula of patient_name + (patient_id) + visit_count
    return state.data.properties.patient_name + "-" +
    state.data.properties.patient_id + "/" +
    state.data.properties.visit_count
  }),
  field('gciclubfoot__Treatment_Provider__c', dataValue('properties.treatment_provider_name'))
));
