// =============================================================================
// Upsert Patient records in Salesforce from patient case updates in Commcare.
// Need to add in relationship to clinic
// =============================================================================
upsert("gciclubfoot__Patient__c", "gciclubfoot__CommCare_Case_ID__c", fields(
  field('gciclubfoot__CommCare_Case_ID__c', dataValue('case_id')),
  // This is required in SF. Which should we use? ==============================
  relationship('gciclubfoot__Clinic__r', 'gciclubfoot__CAST_Location_ID__c', dataValue('properties.owner_id')),
  // relationship('gciclubfoot__Clinic__r', 'gciclubfoot__CAST_Location_ID__c', dataValue('properties.hospital_code')),
  // relationship('gciclubfoot__Clinic__r', 'gciclubfoot__CAST_Location_ID__c', dataValue('indices.parent.location_id')),
  // ===========================================================================
  field('gciclubfoot__CAST_Patient_ID__c', dataValue('properties.patient_id')),
  field('gciclubfoot__Age_Months_First_Brace__c', dataValue('properties.age_months_first_brace_rounded')),
  field('gciclubfoot__Age_Months_Started_Treatment__c', dataValue('properties.age_months_start_treatment_rounded')),
  field('gciclubfoot__Secondary_ID__c', dataValue('properties.secondary_id')),
  field('gciclubfoot__Secondary_ID_Type__c', dataValue('properties.secondary_id_type')),
  field('gciclubfoot__Registration_Date__c', (state) => {
    const validDate = state.data.properties.registration_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Name', dataValue('properties.patient_name')),
  field('gciclubfoot__First_Name__c', dataValue('properties.patient_first_name')),
  field('gciclubfoot__Last_Name__c', dataValue('properties.patient_last_name')),
  field('gciclubfoot__Gender__c', humanProper(state.data.properties.patient_gender)), // picklist
  field('gciclubfoot__Date_of_Birth_Known__c', humanProper(state.data.properties.patient_dob_known)), // picklist
  field('gciclubfoot__Date_of_Birth__c', (state) => {
    const validDate = state.data.properties.patient_dob
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Date_of_First_Brace__c', (state) => {
    const validDate = state.data.properties.date_first_brace
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
   field('gciclubfoot__Date_of_First_Visit__c', (state) => {
    const validDate = state.data.properties.date_first_visit
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
    field('gciclubfoot__Date_of_Tenotomy__c', (state) => {
    const validDate = state.data.properties.date_tenotomy
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
   field('gciclubfoot__Date_Stopped_Treatment__c', (state) => {
    const validDate = state.data.properties.stop_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Location_Level_1__c', dataValue('properties.location_level1_name')),
  field('gciclubfoot__Location_Level_2__c', dataValue('properties.location_level2_name')),
  field('gciclubfoot__City_Town__c', dataValue('properties.location_level3')),
  field('gciclubfoot__Street__c', dataValue('properties.patient_address')),
  field('gciclubfoot__Zip_Code__c', dataValue('properties.pin_code')),
  field('gciclubfoot__Abnormalities__c', (state) => {
    //SF Multi-Select PL Values = No Abnormalities, Lower Extremities, Upper Extremities, Hips, Spine, Head, Heart, Lungs, Urinary, Digestive, Skin, Neurological, Other
    const ms = state.data.properties.abnormalities
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  }),
  field('gciclubfoot__Other_Abnormalities__c', dataValue('properties.abnormalities_other')),
  field('gciclubfoot__Consent_Treatment__c', humanProper(state.data.properties.consent_treatment)), // picklist
  field('gciclubfoot__Consent_Database__c', humanProper(state.data.properties.consent_included)), // picklist
  field('gciclubfoot__Consent_Photograph_Marketing__c', humanProper(state.data.properties.consent_photograph_marketing)), // picklist
  field('gciclubfoot__Consent_Photograph_Treatment__c', humanProper(state.data.properties.consent_photograph_treatment)), // picklist
  field('gciclubfoot__Diagnosis__c', humanProper(state.data.properties.diagnosis)), // picklist
  field('gciclubfoot__Diagnosis_Idiopathic_Specified__c', (state) => {
    //SF Multi-select Untreated (Under 2), Neglected (Over 2), Resistant, Recurrent, Aytpical, Complex
    const ms = state.data.properties.diagnosis_idiopathic_specified
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  }),
  field('gciclubfoot__Diagnosis_Secondary_Specified__c', (state) => {
    //SF multi-select Syndromic, Spina Bifida, Arthrogryposis, Other Neuropathic
    const ms = state.data.properties.diagnosis_secondary_specified
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  }),
  field('gciclubfoot__Diagnosis_Notes__c', dataValue('properties.diagnosis_notes')),
  field('gciclubfoot__Feet_Affected__c', humanProper(state.data.properties.feet_affected)), // picklist
  field('gciclubfoot__Referral_Source__c', humanProper(state.data.properties.referral_source)), // picklist
  field('gciclubfoot__Referral_Source_Other__c', dataValue('properties.referral_source_other')),
  field('gciclubfoot__Referral_Source_Health_Facility_Name__c', dataValue('properties.referral_source_health_facility')),
  field('gciclubfoot__Referral_Source_Doctor_Name__c', dataValue('properties.referral_source_doctor')),
  field('gciclubfoot__Guardian_1_First_Name__c', dataValue('properties.guardian1_first_name')),
  field('gciclubfoot__Guardian_1_Last_Name__c', dataValue('properties.guardian1_last_name')),
  field('gciclubfoot__Guardian_1_Relationship__c', humanProper(state.data.properties.guardian1_relationship)), // picklist
  field('gciclubfoot__Guardian_1_Relationship_Other__c', dataValue('properties.guardian1_relationship_other')),
  field('gciclubfoot__Guardian_1_Phone_Number_1__c', dataValue('properties.guardian1_phone1')),
  field('gciclubfoot__Guardian_1_Phone_Number_2__c', dataValue('properties.guardian1_phone2')),
  field('gciclubfoot__Guardian_2_First_Name__c', dataValue('properties.guardian2_first_name')),
  field('gciclubfoot__Guardian_2_Last_Name__c', dataValue('properties.guardian2_last_name')),
  field('gciclubfoot__Guardian_2_Relationship__c', humanProper(state.data.properties.guardian2_relationship)), // picklist
  field('gciclubfoot__Guardian_2_Relationship_Other__c', dataValue('properties.guardian2_relationship_other')),
  field('gciclubfoot__Guardian_2_Phone_Number_1__c', dataValue('properties.guardian2_phone1')),
  field('gciclubfoot__Guardian_2_Phone_Number_2__c', dataValue('properties.guardian2_phone2')),
  field('gciclubfoot__Guardian_3_First_Name__c', dataValue('properties.guardian3_first_name')),
  field('gciclubfoot__Guardian_3_Last_Name__c', dataValue('properties.guardian3_last_name')),
  field('gciclubfoot__Guardian_3_Relationship__c', humanProper(state.data.properties.guardian3_relationship)), // picklist
  field('gciclubfoot__Guardian_3_Relationship_Other__c', dataValue('properties.guardian3_relationship_other')),
  field('gciclubfoot__Guardian_3_Phone_Number_1__c', dataValue('properties.guardian3_phone1')),
  field('gciclubfoot__Guardian_3_Phone_Number_2__c', dataValue('properties.guardian3_phone2')),
  field('gciclubfoot__Transfer_Date__c', (state) => {
    const validDate = state.data.properties.transfer_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
   field('gciclubfoot__Stopped_Treatment_Reason_Other__c', dataValue('properties.stop_reason_other')),
  field('gciclubfoot__Tribe_Ethnicity__c', dataValue('properties.liberia_tribe_ethnicity')),
  field('gciclubfoot__neigbhorhood__c', dataValue('properties.patient_neighborhood')),
  field('gciclubfoot__Clinic_Transferred_To__c', dataValue('properties.transfer_clinic')),
  field('gciclubfoot__Case_Closed_by_Username_CommCare__c', dataValue('properties.closed_by_username')),
  field('gciclubfoot__Opened_Date_CommCare__c', (state) => {
    const validDate = state.data.properties.opened_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Opened_By_Username_CommCare__c', dataValue('properties.opened_by_username')),
  field('gciclubfoot__Last_Modified_Date_CommCare__c', (state) => {
    const validDate = state.data.properties.last_modified_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Last_Modified_By_Username_CommCare__c', dataValue('properties.last_modified_by_username')),
  field('gciclubfoot__Case_Closed_Date_CommCare__c', (state) => {
    const validDate = state.data.properties.closed_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Reason_Stopped_Treatment__c', humanProper(state.data.properties.close_reason)), // picklist
  field('gciclubfoot__ICR_ID__c', dataValue('properties.patient_original_id')),
  field('gciclubfoot__Owner_Name_CommCare__c', dataValue('owner_name')),
  field('gciclubfoot__Treatment_Completed__c', (state) => {
    return (state.data.properties.treatment_completed == "1" ? true : false)
  })
));
