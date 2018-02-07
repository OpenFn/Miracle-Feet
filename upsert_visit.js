// =============================================================================
// Upsert Visit records in Salesforce when "Visit" cases are updated in CC.
// (Remember to replace all labels with API names before going live.)
// =============================================================================
upsert("Visit__c", "uuid__c", fields(
  field('uuid__c', dataValue("case_id"),
  // =============================================================================================================
  // do not link to clinic for the time being, only link to patient...
  // relationship('Hospital__r', "uuid__c", dataValue('properties.hospital_code')),
  relationship('gciclubfoot__Patient__c', "gciclubfoot__CAST_Patient_ID__c", dataValue('indeces.parent.case_id')),
  // =============================================================================================================
  field('Date', dataValue('properties.visit_date')),
  field('Patient', dataValue('properties.patient_id')),
  // Pretending we need the age in a *rough* number of days...
  field('Patient Age (DAYS) at Time of Visit', function(state) {
    return (state.data.properties.patient_age_months * 30.42)
  },
  field('Patient Presented with Relapse', dataValue('properties.recurrence')),
  // Pretending we must remove underscores from a picklist value in CommCare...
  field('Relapse Type', function(state) {
    return state.data.properties.recurrence_type.split('_').join(' ')
  }),
  field('Brace Problems', dataValue('properties.brace_problems')),
  field('Brace Problems Specified', dataValue('properties.brace_problems_specified')),
  field('Brace Problems Type', dataValue('properties.brace_problems_type')),
  // Pretending we need to convert an array of complications into a multi-select
  // picklist values string for Salesforce...
  field('Complications', arrayToString(
    dataValue('properties.complications'),
    ";"
  ),
  field('Complication Types', dataValue('properties.complication_type')),
  field('Other Complications', dataValue('properties.complication_type_other')),
  field('R Medial Crease', dataValue('properties.r_medial_crease')),
  field('R Talar Head', dataValue('properties.r_talar_head')),
  field('R Curved Lateral Border', dataValue('properties.r_curved_lateral_border')),
  field('R Midfoot Score', dataValue('properties.r_midfoot_score')),
  field('R Posterior Crease', dataValue('properties.r_posterior_crease')),
  field('R Empty Heel', dataValue('properties.r_empty_heel')),
  field('R Rigid Equinus', dataValue('properties.r_rigid_equinus')),
  field('R Hindfoot Score', dataValue('properties.r_hindfoot_score')),
  field('R Total Score', dataValue('properties.r_total_score')),
  field('R Angle Abduction', dataValue('properties.r_angle_abduction')),
  field('R Angle Dorsiflexion', dataValue('properties.r_angle_dorsiflexion')),
  field('R Treatment', dataValue('properties.r_treatment')),
  field('R Surgery Type', dataValue('properties.r_surgery_type')),
  field('R Surgery Type Other', dataValue('properties.r_surgery_type_other')),
  field('L Medial Crease', dataValue('properties.l_medial_crease')),
  field('L Talar Head', dataValue('properties.l_talar_head')),
  field('L Curved Lateral Border', dataValue('properties.l_curved_lateral_border')),
  field('L Midfoot Score', dataValue('properties.l_midfoot_score')),
  field('L Posterior Crease', dataValue('properties.l_posterior_crease')),
  field('L Empty Heel', dataValue('properties.l_empty_heel')),
  field('L Rigid Equinus', dataValue('properties.l_rigid_equinus')),
  field('L Hindfoot Score', dataValue('properties.l_hindfoot_score')),
  field('L Total Score', dataValue('properties.l_total_score')),
  field('L Angle Abduction', dataValue('properties.l_angle_abduction')),
  field('L Angle Dorsiflexion', dataValue('properties.l_angle_dorsiflexion')),
  field('Treatment', dataValue('properties.l_treatment')),
  field('L Surgery Type', dataValue('properties.l_surgery_type')),
  field('L Surgery Type Other', dataValue('properties.l_surgery_type_other')),
  field('First Brace Given', dataValue('properties.is_first_brace')),
  field('New Brace Given', dataValue('properties.is_new_brace')),
  field('Notes', dataValue('properties.visit_notes')),
  field('Treatment Provider ', dataValue('properties.treatment_provider_name')),
  field('Use for mapping Patient Master-Detail? ', dataValue('properties.patient_caseid')),
  field('Last Modified By Username', dataValue('properties.last_modified_by_username')),
  field('CommCare Case ID', dataValue('properties.caseid')),
  field('R Score Same', dataValue('properties.r_score_same')),
  field('L Score Same', dataValue('properties.l_score_same')),
  field('L Score Improved', dataValue('properties.l_score_improved')),
  field('R Score Improved', dataValue('properties.r_score_improved')),
  field('R Treatment Other', dataValue('properties.r_treatment_other')),
  field('L Treatment Other', dataValue('properties.l_treatment_other')),
  field('L Score Not Improved', dataValue('properties.l_score_not_improved')),
  field('R Score Not Improved', dataValue('properties.r_score_not_improved')),
  field('Mobile User Visit Case Closed By in CAST', dataValue('properties.closed_by_username')),
  field('Date Visit Case Closed in CAST', dataValue('properties.closed_date')),
  field('Date Visit Case Last Modified Date', dataValue('properties.last_modified_date')),
  field('Date Visit Case Opened in CAST', dataValue('properties.opened_date')),
  field('Mobile User Visit Created By in CAST', dataValue('properties.opened_by_username'))
));
