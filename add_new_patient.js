upsert("gciclubfoot__Patient__c", "gciclubfoot__CommCare_Case_ID__c", fields(
  field('gciclubfoot__CommCare_Case_ID__c', dataValue("form.case.@case_id")),
  relationship('gciclubfoot__Clinic__r', 'gciclubfoot__CAST_Location_ID__c', dataValue('form.case.create.owner_id')),
  field('gciclubfoot__First_Name__c', humanProper(state.data.form.case.update.patient_first_name)),
  field('gciclubfoot__Last_Name__c', humanProper(state.data.form.case.update.patient_last_name)),
  field('gciclubfoot__CAST_Patient_ID__c', dataValue('form.case.update.patient_id')),
  field('gciclubfoot__Age_Months_First_Brace__c', dataValue('form.case.update.age_months_first_brace_rounded')),
  field('gciclubfoot__Age_Months_Started_Treatment__c', dataValue('form.case.update.age_months_start_treatment_rounded')),
  field('gciclubfoot__Secondary_ID__c', dataValue('form.case.update.secondary_id')),
  field('gciclubfoot__Secondary_ID_Type__c', dataValue('form.case.update.secondary_id_type')),
  field('gciclubfoot__Registration_Date__c', (state) => {
    const validDate = state.data.form.case.update.registration_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('Name', humanProper(state.data.form.case.update.patient_name)),
  field('gciclubfoot__Gender__c', humanProper(state.data.form.case.update.patient_gender)),
  field('gciclubfoot__Date_of_Birth_Known__c', humanProper(state.data.form.case.update.patient_dob_known)),
  field('gciclubfoot__Date_of_Birth__c', (state) => {
    const validDate = state.data.form.case.update.patient_dob
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Date_of_First_Brace__c', (state) => {
    const validDate = state.data.form.case.update.date_first_brace
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
   field('gciclubfoot__Date_of_First_Visit__c', (state) => {
    const validDate = state.data.form.case.update.date_first_visit
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
    field('gciclubfoot__Date_of_Tenotomy__c', (state) => {
    const validDate = state.data.form.case.update.date_tenotomy
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
   field('gciclubfoot__Date_Stopped_Treatment__c', (state) => {
    const validDate = state.data.form.case.update.stop_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Location_Level_1__c', dataValue('form.case.update.location_level1_name')),
  field('gciclubfoot__Location_Level_2__c', dataValue('form.case.update.location_level2_name')),
  field('gciclubfoot__City_Town__c', dataValue('form.case.update.location_level3')),
  field('gciclubfoot__Street__c', dataValue('form.case.update.patient_address')),
  field('gciclubfoot__Street__c', dataValue('form.case.update.patient_address')),
  field('gciclubfoot__Neighborhood__c', dataValue('form.case.update.patient_neighborhood')),
  field('gciclubfoot__Abnormalities__c', (state) => {
    const ms = state.data.form.case.update.abnormalities
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  }),
  field('gciclubfoot__Other_Abnormalities__c', dataValue('form.case.update.abnormalities_other')),
  field('gciclubfoot__Consent_Treatment__c', humanProper(state.data.form.case.update.consent_treatment)),
  field('gciclubfoot__Consent_Database__c', humanProper(state.data.form.case.update.consent_included)),
  field('gciclubfoot__Consent_Photograph_Marketing__c', humanProper(state.data.form.case.update.consent_photograph_marketing)),
  field('gciclubfoot__Consent_Photograph_Treatment__c', humanProper(state.data.form.case.update.consent_photograph_treatment)),
  field('gciclubfoot__Diagnosis__c', humanProper(state.data.form.case.update.diagnosis)),
  field('gciclubfoot__Diagnosis_Idiopathic_Specified__c', (state) => {
    const ms = state.data.form.case.update.diagnosis_idiopathic_specified
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  }),
  field('gciclubfoot__Diagnosis_Secondary_Specified__c', (state) => {
    const ms = state.data.form.case.update.diagnosis_secondary_specified
    if (ms) {
      return ms.replace(/ /gi, ';').toLowerCase().split(';').map((value) => {
        return humanProper(value)
      }).join(';');
    } else { return "" }
  }),
  field('gciclubfoot__Diagnosis_Notes__c', dataValue('form.case.update.diagnosis_notes')),
  field('gciclubfoot__Feet_Affected__c', humanProper(state.data.form.case.update.feet_affected)),
  field('gciclubfoot__Referral_Source__c', humanProper(state.data.form.case.update.referral_source)),
  field('gciclubfoot__Referral_Source_Other__c', dataValue('form.case.update.referral_source_other')),
  field('gciclubfoot__Referral_Source_Health_Facility_Name__c', dataValue('form.case.update.referral_source_hf')),
  field('gciclubfoot__Referral_Source_Doctor_Name__c', dataValue('form.case.update.referral_source_doctor')),
  field('gciclubfoot__Guardian_1_First_Name__c', dataValue('form.case.update.guardian1_first_name')),
  field('gciclubfoot__Guardian_1_Last_Name__c', dataValue('form.case.update.guardian1_last_name')),
  field('gciclubfoot__Guardian_1_Relationship__c', humanProper(state.data.form.case.update.guardian1_relationship)),
  field('gciclubfoot__Guardian_1_Relationship_Other__c', dataValue('form.case.update.guardian1_relationship_other')),
  field('gciclubfoot__Guardian_1_Phone_Number_1__c', dataValue('form.case.update.guardian1_phone1')),
  field('gciclubfoot__Guardian_1_Phone_Number_2__c', dataValue('form.case.update.guardian1_phone2')),
  field('gciclubfoot__Guardian_2_First_Name__c', dataValue('form.case.update.guardian2_first_name')),
  field('gciclubfoot__Guardian_2_Last_Name__c', dataValue('form.case.update.guardian2_last_name')),
  field('gciclubfoot__Guardian_2_Relationship__c', humanProper(state.data.form.case.update.guardian2_relationship)),
  field('gciclubfoot__Guardian_2_Relationship_Other__c', dataValue('form.case.update.guardian2_relationship_other')),
  field('gciclubfoot__Guardian_2_Phone_Number_1__c', dataValue('form.case.update.guardian2_phone1')),
  field('gciclubfoot__Guardian_2_Phone_Number_2__c', dataValue('form.case.update.guardian2_phone2')),
  field('gciclubfoot__Guardian_3_First_Name__c', dataValue('form.case.update.guardian3_first_name')),
  field('gciclubfoot__Guardian_3_Last_Name__c', dataValue('form.case.update.guardian3_last_name')),
  field('gciclubfoot__Guardian_3_Relationship__c', humanProper(state.data.form.case.update.guardian3_relationship)),
  field('gciclubfoot__Guardian_3_Relationship_Other__c', dataValue('form.case.update.guardian3_relationship_other')),
  field('gciclubfoot__Guardian_3_Phone_Number_1__c', dataValue('form.case.update.guardian3_phone1')),
  field('gciclubfoot__Guardian_3_Phone_Number_2__c', dataValue('form.case.update.guardian3_phone2')),
  field('gciclubfoot__Tenotomy_Given__c', humanProper(state.data.form.case.update.tenotomy_given)),
  field('gciclubfoot__Tenotomy_Hospital__c', dataValue('form.case.update.tenotomy_hospital')),
  field('gciclubfoot__Tenotomy_Provider__c', dataValue('form.case.update.tenotomy_provider')),
  field('gciclubfoot__Tenotomy_Reason_Not_Given__c', humanProper(state.data.form.case.update.tenotomy_reason_not_given)),
  field('gciclubfoot__Transfer_Date__c', (state) => {
    const validDate = state.data.form.case.update.transfer_date
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Stopped_Treatment_Reason_Other__c', dataValue('form.case.update.stop_reason_other')),
  field('gciclubfoot__Tribe_Ethnicity__c', humanProper(state.data.form.case.update.tribe_ethnicity)),
  field('gciclubfoot__Clinic_Transferred_To__c', dataValue('form.case.update.transfer_clinic')),
  field('gciclubfoot__Opened_Date_CommCare__c', (state) => {
    const validDate = state.data.form.commcare_usercase.case['@date_modified']
    return ( validDate ? new Date(validDate).toISOString() : null )
  }),
  field('gciclubfoot__Opened_By_Username_CommCare__c', dataValue('form.meta.username')),
  field('gciclubfoot__Owner_Name_CommCare__c', dataValue('form.meta.username')),
  field('gciclubfoot__Reason_Stopped_Treatment__c', humanProper(state.data.form.case.update.close_reason)),
  field('gciclubfoot__ICR_ID__c', dataValue('form.case.update.patient_original_id')),
  field('gciclubfoot__Treatment_Completed__c', (state) => {
    return (state.data.form.case.update.treatment_completed == "1" ? true : false)
  }),
  field("gciclubfoot__Registration_Photo_1__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo1;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Registration_Photo_2__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo2;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Registration_Photo_3__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo3;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Registration_Photo_4__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.photo4;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  }),
  field("gciclubfoot__Consent_Signature__c", function(state) {
    const baseUrl = `https://www.commcarehq.org/a/${state.data.domain}/api/form/attachment/`;
    const uuid = state.data.metadata.instanceID;
    const image = state.data.form.photos.guardian_signature;
    return ( image ? `${baseUrl}${uuid}/${image}` : "" )
  })
));
