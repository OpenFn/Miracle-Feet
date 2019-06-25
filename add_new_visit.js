alterState((state) => {
  state.handlePhoto = function handlePhoto(state, photoField) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const hasPhotos = (state.data.form.photos && state.data.form.photos.add_photos == "yes")
    const image = (hasPhotos ? state.data.form.photos.photos[`${photoField}`] : null);
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  };

  state.handleMultiSelect = function(state, multiField) {
    const ms = state.data.form.subcase_0.case.update[`${multiField}`]
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  };

  return state
});

upsert("gciclubfoot__Visit__c", "gciclubfoot__commcare_case_id__c", fields(
  field('gciclubfoot__commcare_case_id__c', dataValue('form.subcase_0.case.@case_id')),
  relationship('gciclubfoot__Patient__r', "gciclubfoot__CommCare_Case_ID__c", dataValue('form.case.@case_id')),
  field('gciclubfoot__Visit_Date__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.visit_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Next_Visit_Date__c', (state) => {
    const validDate = state.data.form.case.update.update.next_visit_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Brace_Count__c', dataValue('form.subcase_0.case.update.brace_count')),
  field('gciclubfoot__Brace_Problems__c', dataValue('form.subcase_0.case.update.brace_problems')), // picklist
  field('gciclubfoot__Brace_Problems_Notes__c', dataValue('form.subcase_0.case.update.brace_problems_specified')),
  field('gciclubfoot__Brace_Problems_Type__c', (state) => {
    return state.handleMultiSelect(state, "brace_problems_type")
  }),
  field('gciclubfoot__Brace_Type__c', (state) => {
      const ref = state.data.form.subcase_0.case.update
      return ( ref.brace_type == null ? ref.brace_type_india : ref.brace_type );
    }),
  field('gciclubfoot__Brace_Condition_Non_MiracleFeet_Brace__c', humanProper(state.data.form.subcase_0.case.update.brace_condition)), // picklist
  field('Steenbeek_Brace_Size__c', humanProper(state.data.form.subcase_0.case.update.steenbeek_size)),
  field('gciclubfoot__MiracleFeet_Bar_Condition__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_bar_condition)), // picklist
  field('gciclubfoot__MiracleFeet_Bar_Size__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_bar_size)), // picklist
  field('gciclubfoot__MiracleFeet_Shoe_Size__c', (state) => {
      const form = state.data.form.subcase_0.case.update
      return ( form.miraclefeet_shoe_size ? form.miraclefeet_shoe_size_india : form.miraclefeet_shoe_size );
    }),
  field('gciclubfoot__MiracleFeet_Brace_Given__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_brace_given)), // picklist
  field('gciclubfoot__MiracleFeet_Shoes_Condition__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_shoes_condition)), // picklist
  field('gciclubfoot__Cast_Count__c', dataValue('form.subcase_0.case.update.cast_count')),
  field('gciclubfoot__Casting_Complications_Type__c', (state) => {
    return state.handleMultiSelect(state, "complication_type")
  }),
  field('gciclubfoot__Casting_Complications_Notes__c', dataValue('form.subcase_0.case.update.complication_type_other')),
  field('gciclubfoot__Date_Referral_Made__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_referral_made
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Date_of_Tenotomy__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_tenotomy
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__First_Brace__c', (state) => {
    return (state.data.form.subcase_0.case.update.is_first_brace == "1" ? true : false) // sf checkbox
  }),
  field('gciclubfoot__ICR_ID__c', dataValue('form.subcase_0.case.update.visit_original_id')),
  field('gciclubfoot__Left_Angle_of_Abduction__c', dataValue('form.subcase_0.case.update.l_angle_abduction')),
  field('gciclubfoot__Left_Angle_of_Dorsiflexion__c', dataValue('form.subcase_0.case.update.l_angle_dorsiflexion')),
  field('gciclubfoot__Left_Medial_Crease__c', dataValue('form.subcase_0.case.update.l_medial_crease')),
  field('gciclubfoot__Left_Talar_Head__c', dataValue('form.subcase_0.case.update.l_talar_head')),
  field('gciclubfoot__Left_Curved_Lateral_Border__c', dataValue('form.subcase_0.case.update.l_curved_lateral_border')),
  field('gciclubfoot__Left_Midfoot_Score__c', dataValue('form.subcase_0.case.update.l_midfoot_score')),
  field('gciclubfoot__Left_Posterior_Crease__c', dataValue('form.subcase_0.case.update.l_posterior_crease')),
  field('gciclubfoot__Left_Empty_Heel__c', dataValue('form.subcase_0.case.update.l_empty_heel')),
  field('gciclubfoot__Left_Rigid_Equinus__c', dataValue('form.subcase_0.case.update.l_rigid_equinus')),
  field('gciclubfoot__Left_Hindfoot_Score__c', dataValue('form.subcase_0.case.update.l_hindfoot_score')),
  field('gciclubfoot__Left_Pirani_Total_Score__c', dataValue('form.subcase_0.case.update.l_total_score')),
  field('gciclubfoot__Left_Pirani_Score_Improved__c', dataValue('form.subcase_0.case.update.l_score_improved')),
  field('gciclubfoot__Left_Pirani_Score_Not_Improved__c', dataValue('form.subcase_0.case.update.l_score_not_improved')),
  field('gciclubfoot__Left_Pirani_Score_Same__c', dataValue('form.subcase_0.case.update.l_score_same')),
  field('gciclubfoot__Left_Treatment__c', humanProper(state.data.form.subcase_0.case.update.l_treatment)), // picklist
  field('gciclubfoot__Left_Treatment_Other__c', dataValue('form.subcase_0.case.update.l_treatment_other')),
  field('gciclubfoot__Left_Surgery_Type__c', humanProper(state.data.form.subcase_0.case.update.l_surgery_type)), // picklist
  field('gciclubfoot__Left_Surgery_Type_Other__c', dataValue('form.subcase_0.case.update.l_surgery_type_other')),
  field('gciclubfoot__Right_Angle_of_Abduction__c', dataValue('form.subcase_0.case.update.r_angle_abduction')),
  field('gciclubfoot__Right_Angle_of_Dorsiflexion__c', dataValue('form.subcase_0.case.update.r_angle_dorsiflexion')),
  field('gciclubfoot__Right_Medial_Crease__c', dataValue('form.subcase_0.case.update.r_medial_crease')),
  field('gciclubfoot__Right_Talar_Head__c', dataValue('form.subcase_0.case.update.r_talar_head')),
  field('gciclubfoot__Right_Curved_Lateral_Border__c', dataValue('form.subcase_0.case.update.r_curved_lateral_border')),
  field('gciclubfoot__Right_Midfoot_Score__c', dataValue('form.subcase_0.case.update.r_midfoot_score')),
  field('gciclubfoot__Right_Posterior_Crease__c', dataValue('form.subcase_0.case.update.r_posterior_crease')),
  field('gciclubfoot__Right_Empty_Heel__c', dataValue('form.subcase_0.case.update.r_empty_heel')),
  field('gciclubfoot__Right_Rigid_Equinus__c', dataValue('form.subcase_0.case.update.r_rigid_equinus')),
  field('gciclubfoot__Right_Hindfoot_Score__c', dataValue('form.subcase_0.case.update.r_hindfoot_score')),
  field('gciclubfoot__Right_Total_Pirani_Score__c', dataValue('form.subcase_0.case.update.r_total_score')),
  field('gciclubfoot__Right_Pirani_Score_Improved__c', dataValue('form.subcase_0.case.update.r_score_improved')),
  field('gciclubfoot__Right_Pirani_Score_Not_Improved__c', dataValue('form.subcase_0.case.update.r_score_not_improved')),
  field('gciclubfoot__Right_Pirani_Score_Same__c', dataValue('form.subcase_0.case.update.r_score_same')),
  field('gciclubfoot__Right_Treatment__c', humanProper(state.data.form.subcase_0.case.update.r_treatment)), // picklist
  field('gciclubfoot__Right_Treatment_Other__c', dataValue('form.subcase_0.case.update.r_treatment_other')),
  field('gciclubfoot__Right_Surgery_Type__c', humanProper(state.data.form.subcase_0.case.update.r_surgery_type)),
  field('gciclubfoot__Right_Surgery_Type_Other__c', dataValue('form.subcase_0.case.update.r_surgery_type_other')),
  field('gciclubfoot__New_Brace__c', dataValue('form.subcase_0.case.update.is_new_brace')),
  field('Bracing_Stage__c', dataValue('form.subcase_0.case.update.bracing_stage')),
  field('gciclubfoot__Next_Visit_Date__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.next_visit_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Opened_Date_CommCare__c', (state) => {
    const validDate = state.data.form.subcase_0.case['@date_modified']
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),

  //Relapse questions ==========================================================
  field('gciclubfoot__Relapse__c', humanProper(state.data.form.subcase_0.case.update.recurrence)), // picklist
  field('gciclubfoot__Relapse_Count__c', dataValue('form.subcase_0.case.update.recurrence_count')),
  field('gciclubfoot__Relapse_Feet_Affected__c', humanProper(state.data.form.subcase_0.case.update.recurrence_feet_affected)), // picklist
  field('gciclubfoot__Relapse_Type_Left__c', (state) => {
    return state.handleMultiSelect(state, "recurrence_type_left")
  }),
  field('gciclubfoot__Relapse_Type_Right__c', (state) => {
    return state.handleMultiSelect(state, "recurrence_type_right")
  }),
  // ===========================================================================

  // Referral Questions ========================================================
  field('gciclubfoot__Date_Referral_Made__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_referral_made
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Referral_Hospital__c', dataValue('form.subcase_0.case.update.referral_hospital')),
  field('gciclubfoot__Referral_Provider__c', dataValue('form.subcase_0.case.update.referral_provider')),
  field('gciclubfoot__Referral_Surgery_Type__c', humanProper(state.data.form.subcase_0.case.update.referral_surgery_type)), // picklist
  field('gciclubfoot__Referral_Surgery_Type_Other__c', dataValue('form.subcase_0.case.update.referral_surgery_type_other')),
  field('gciclubfoot__Referral_Treatment_Date__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.referral_treatment_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Referral_Type__c', humanProper(state.data.form.subcase_0.case.update.referral_type)), // picklist
  field('gciclubfoot__Referral_Advanced_Care_Specified__c', dataValue('form.subcase_0.case.update.referral_advanced_care')),
  // ===========================================================================

  // Tenotomy Questions ========================================================
  field('gciclubfoot__Date_of_Tenotomy__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_tenotomy
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Tenotomy_Given__c', humanProper(state.data.form.subcase_0.case.update.tenotomy_given)), // picklist
  field('gciclubfoot__Tenotomy_Hospital__c', dataValue('form.subcase_0.case.update.tenotomy_hospital')),
  field('gciclubfoot__Tenotomy_Provider__c', dataValue('form.subcase_0.case.update.tenotomy_provider')),
  // ===========================================================================

  field('gciclubfoot__Treatment_Completed__c', (state) => {
    return (state.data.form.subcase_0.case.update.treatment_completed == "1" ? true : false) // sf checkbox
  }),
  field('gciclubfoot__Visit_Count__c', dataValue('form.subcase_0.case.update.visit_count')),
  field('Name', (state) => {
    return state.data.form.subcase_0.case.update.patient_name + "(" +
    state.data.form.subcase_0.case.update.patient_id + ") (" +
    state.data.form.subcase_0.case.update.visit_date + ")"
  }),
  field('gciclubfoot__Visit_Notes__c', dataValue('form.subcase_0.case.update.visit_notes')),
  field('gciclubfoot__Treatment_Provider__c', dataValue('form.subcase_0.case.update.treatment_provider')),
  field("gciclubfoot__Photo_1_URL__c", function(state) {
    return state.handlePhoto(state, "photo_1");
  }),
  field("gciclubfoot__Photo_2_URL__c", function(state) {
    return state.handlePhoto(state, "photo_2");
  }),
  field("gciclubfoot__Photo_3_URL__c", function(state) {
    return state.handlePhoto(state, "photo_3");
  })
));
