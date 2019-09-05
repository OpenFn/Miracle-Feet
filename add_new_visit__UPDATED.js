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

upsert("Visit_new__c", "gciclubfootommcare_case_id__c", fields(
  field('commcare_case_id__c', dataValue('form.subcase_0.case.@case_id')),
  relationship('Contact', "CommCare_Case_ID__c", dataValue('form.case.@case_id')),
  field('Visit_Date__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.visit_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Next_Visit_Date__c', (state) => {
    const validDate = state.data.form.case.update.update.next_visit_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Brace_Count__c', dataValue('form.subcase_0.case.update.brace_count')),
  field('Brace_Problems__c', humanProper('form.subcase_0.case.update.brace_problems')), // picklist
  field('Brace_Problems_Notes__c', dataValue('form.subcase_0.case.update.brace_problems_specified')),
  field('Brace_Problems_Type__c', (state) => {
    return state.handleMultiSelect(state, "brace_problems_type")
  }),
  field('Brace_Type__c', (state) => {
      const ref = state.data.form.subcase_0.case.update
      return ( ref.brace_type ? ref.brace_type_india : ref.brace_type );
    }),
  field('Brace_Condition_Non_MiracleFeet_Brace__c', humanProper(state.data.form.subcase_0.case.update.brace_condition)), // picklist
  field('MiracleFeet_Bar_Condition__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_bar_condition)), // picklist
  field('MiracleFeet_Bar_Size__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_bar_size)), // picklist
  field('MiracleFeet_Shoe_Size__c', (state) => {
      const steen = state.data.form.case.update.steenbeek_size
      const india = state.data.form.case.update.steenbeek_size_india
      var shoe = '';
      if (steen==undefined) {
        shoe=india.charAt(0).toUpperCase() + india.slice(1).replace('_', ' ');
      } else {
        shoe=steen.charAt(0).toUpperCase() + steen.slice(1).replace('_', ' ');
      }
      return shoe;
      //const form = state.data.form.subcase_0.case.update
    //  return ( form.miraclefeet_shoe_size ? form.miraclefeet_shoe_size_india : form.miraclefeet_shoe_size );

  //  const shoe = ( state.data.form.case.update.steenbeek_size == undefined ? state.data.form.case.update.steenbeek_size_india : state.data.form.case.update.steenbeek_size );
  //  var size = shoe.charAt(0).toUpperCase() + shoe.slice(1).replace('_', ' ');
    }),
  field('MiracleFeet_Brace_Given__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_brace_given)), // picklist
  field('MiracleFeet_Shoes_Condition__c', humanProper(state.data.form.subcase_0.case.update.miraclefeet_shoes_condition)), // picklist
  field('Cast_Count__c', dataValue('form.subcase_0.case.update.cast_count')),
  field('Casting_Complications_Type__c', (state) => {
    return state.handleMultiSelect(state, "complication_type")
  }),
  field('Casting_Complications_Notes__c', dataValue('form.subcase_0.case.update.complication_type_other')),
  field('Date_Referral_Made__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_referral_made
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Date_of_Tenotomy__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_tenotomy
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('First_Brace__c', (state) => {
    return (state.data.form.subcase_0.case.update.is_first_brace == "1" ? true : false) // sf checkbox
  }),
  field('ICR_ID__c', dataValue('form.subcase_0.case.update.visit_original_id')),
  field('Left_Angle_of_Abduction__c', dataValue('form.subcase_0.case.update.l_angle_abduction')),
  field('Left_Angle_of_Dorsiflexion__c', dataValue('form.subcase_0.case.update.l_angle_dorsiflexion')),
  field('Left_Medial_Crease__c', dataValue('form.subcase_0.case.update.l_medial_crease')),
  field('Left_Talar_Head__c', dataValue('form.subcase_0.case.update.l_talar_head')),
  field('Left_Curved_Lateral_Border__c', dataValue('form.subcase_0.case.update.l_curved_lateral_border')),
  field('Left_Midfoot_Score__c', dataValue('form.subcase_0.case.update.l_midfoot_score')),
  field('Left_Posterior_Crease__c', dataValue('form.subcase_0.case.update.l_posterior_crease')),
  field('Left_Empty_Heel__c', dataValue('form.subcase_0.case.update.l_empty_heel')),
  field('Left_Rigid_Equinus__c', dataValue('form.subcase_0.case.update.l_rigid_equinus')),
  field('Left_Hindfoot_Score__c', dataValue('form.subcase_0.case.update.l_hindfoot_score')),
  field('Left_Pirani_Total_Score__c', dataValue('form.subcase_0.case.update.l_total_score')),
  field('Left_Pirani_Score_Improved__c', dataValue('form.subcase_0.case.update.l_score_improved')),
  field('Left_Pirani_Score_Not_Improved__c', dataValue('form.subcase_0.case.update.l_score_not_improved')),
  field('Left_Pirani_Score_Same__c', dataValue('form.subcase_0.case.update.l_score_same')),
  field('Left_Treatment__c', humanProper(state.data.form.subcase_0.case.update.l_treatment)), // picklist
  field('Left_Treatment_Other__c', dataValue('form.subcase_0.case.update.l_treatment_other')),
  field('Left_Surgery_Type__c', humanProper(state.data.form.subcase_0.case.update.l_surgery_type)), // picklist
  field('Left_Surgery_Type_Other__c', dataValue('form.subcase_0.case.update.l_surgery_type_other')),
  field('Right_Angle_of_Abduction__c', dataValue('form.subcase_0.case.update.r_angle_abduction')),
  field('Right_Angle_of_Dorsiflexion__c', dataValue('form.subcase_0.case.update.r_angle_dorsiflexion')),
  field('Right_Medial_Crease__c', dataValue('form.subcase_0.case.update.r_medial_crease')),
  field('Right_Talar_Head__c', dataValue('form.subcase_0.case.update.r_talar_head')),
  field('Right_Curved_Lateral_Border__c', dataValue('form.subcase_0.case.update.r_curved_lateral_border')),
  field('Right_Midfoot_Score__c', dataValue('form.subcase_0.case.update.r_midfoot_score')),
  field('Right_Posterior_Crease__c', dataValue('form.subcase_0.case.update.r_posterior_crease')),
  field('Right_Empty_Heel__c', dataValue('form.subcase_0.case.update.r_empty_heel')),
  field('Right_Rigid_Equinus__c', dataValue('form.subcase_0.case.update.r_rigid_equinus')),
  field('Right_Hindfoot_Score__c', dataValue('form.subcase_0.case.update.r_hindfoot_score')),
  field('Right_Total_Pirani_Score__c', dataValue('form.subcase_0.case.update.r_total_score')),
  field('Right_Pirani_Score_Improved__c', dataValue('form.subcase_0.case.update.r_score_improved')),
  field('Right_Pirani_Score_Not_Improved__c', dataValue('form.subcase_0.case.update.r_score_not_improved')),
  field('Right_Pirani_Score_Same__c', dataValue('form.subcase_0.case.update.r_score_same')),
  field('Right_Treatment__c', humanProper(state.data.form.subcase_0.case.update.r_treatment)), // picklist
  field('Right_Treatment_Other__c', dataValue('form.subcase_0.case.update.r_treatment_other')),
  field('Right_Surgery_Type__c', humanProper(state.data.form.subcase_0.case.update.r_surgery_type)),
  field('Right_Surgery_Type_Other__c', dataValue('form.subcase_0.case.update.r_surgery_type_other')),
  field('New_Brace__c', dataValue('form.subcase_0.case.update.is_new_brace')),
  field('Next_Visit_Date__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.next_visit_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Opened_Date_CommCare__c', (state) => {
    const validDate = state.data.form.subcase_0.case['@date_modified']
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),

  //Relapse questions ==========================================================
  field('Relapse__c', humanProper(state.data.form.subcase_0.case.update.recurrence)), // picklist
  field('Relapse_Count__c', dataValue('form.subcase_0.case.update.recurrence_count')),
  field('Relapse_Feet_Affected__c', humanProper(state.data.form.subcase_0.case.update.recurrence_feet_affected)), // picklist
  field('Relapse_Type_Left__c', (state) => {
    return state.handleMultiSelect(state, "recurrence_type_left")
  }),
  field('Relapse_Type_Right__c', (state) => {
    return state.handleMultiSelect(state, "recurrence_type_right")
  }),
  // ===========================================================================

  // Referral Questions ========================================================
  field('Date_Referral_Made__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_referral_made
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Referral_Hospital__c', dataValue('form.subcase_0.case.update.referral_hospital')),
  field('Referral_Provider__c', dataValue('form.subcase_0.case.update.referral_provider')),
  field('Referral_Surgery_Type__c', humanProper(state.data.form.subcase_0.case.update.referral_surgery_type)), // picklist
  field('Referral_Surgery_Type_Other__c', dataValue('form.subcase_0.case.update.referral_surgery_type_other')),
  field('Referral_Treatment_Date__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.referral_treatment_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Referral_Type__c', humanProper(state.data.form.subcase_0.case.update.referral_type)), // picklist
  field('Referral_Advanced_Care_Specified__c', dataValue('form.subcase_0.case.update.referral_advanced_care')),
  // ===========================================================================

  // Tenotomy Questions ========================================================
  field('Date_of_Tenotomy__c', (state) => {
    const validDate = state.data.form.subcase_0.case.update.date_tenotomy
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Tenotomy_Given__c', humanProper(state.data.form.subcase_0.case.update.tenotomy_given)), // picklist
  field('Tenotomy_Hospital__c', dataValue('form.subcase_0.case.update.tenotomy_hospital')),
  field('Tenotomy_Provider__c', dataValue('form.subcase_0.case.update.tenotomy_provider')),
  // ===========================================================================

  field('Treatment_Completed__c', (state) => {
    return (state.data.form.subcase_0.case.update.treatment_completed == "1" ? true : false) // sf checkbox
  }),
  field('Visit_Count__c', dataValue('form.subcase_0.case.update.visit_count')),
  field('Name', (state) => {
    return state.data.form.subcase_0.case.update.patient_name + "(" +
    state.data.form.subcase_0.case.update.patient_id + ") (" +
    state.data.form.subcase_0.case.update.visit_date + ")"
  }),
  field('Visit_Notes__c', dataValue('form.subcase_0.case.update.visit_notes')),
  field('Treatment_Provider__c', dataValue('form.subcase_0.case.update.treatment_provider')),
  field("Photo_1_URL__c", function(state) {
    return state.handlePhoto(state, "photo_1");
  }),
  field("Photo_2_URL__c", function(state) {
    return state.handlePhoto(state, "photo_2");
  }),
  field("Photo_3_URL__c", function(state) {
    return state.handlePhoto(state, "photo_3");
  })
));