// =============================================================================
// Upsert Patient records in Salesforce from patient case updates in Commcare.
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
  "gciclubfoot__Patient__c", "gciclubfoot__CommCare_Case_ID__c", fields(
    field('gciclubfoot__CommCare_Case_ID__c', dataValue('case_id')),
    relationship('gciclubfoot__Clinic__r', 'gciclubfoot__CAST_Location_ID__c', dataValue('properties.owner_id')),
    field('gciclubfoot__CAST_Patient_ID__c', dataValue('properties.patient_id')),
    field('gciclubfoot__Age_Months_First_Brace__c', dataValue('properties.age_months_first_brace_rounded')),
    field('gciclubfoot__Age_Months_Started_Treatment__c', dataValue('properties.age_months_start_treatment_rounded')),
    field('gciclubfoot__Secondary_ID__c', dataValue('properties.patient_file_number')),
    field('gciclubfoot__Secondary_ID_Type__c', dataValue('properties.secondary_id_type')),
    field('gciclubfoot__Registration_Date__c', (state) => {
      const validDate = state.data.properties.registration_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('Name', humanProper(state.data.properties.patient_name)),
    field('gciclubfoot__First_Name__c', humanProper(state.data.properties.patient_first_name)),
    field('gciclubfoot__Last_Name__c', humanProper(state.data.properties.patient_last_name)),
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
    field('Location_Level_3__c', dataValue('properties.location_level3_name')),
    field('City__c', dataValue('properties.city')),
    field('gciclubfoot__City_Town__c', dataValue('properties.location_level3')),
    field('gciclubfoot__Street__c', dataValue('properties.patient_address')),
    field('gciclubfoot__Neighborhood__c', dataValue('properties.patient_neighborhood')),
    field('gciclubfoot__Country__c', dataValue('properties.patient_country')),
    field('gciclubfoot__Zip_Code__c', dataValue('properties.pin_code')),
    field('gciclubfoot__Most_Recent_Treatment_Left__c', (state) => {
       const left =state.data.properties.l_treatment;
       var capLeft = '';
       if (typeof left==='undefined'){
         capLeft='';
       } else {
         capLeft=left.charAt(0).toUpperCase() + left.slice(1);
       }
      return capLeft;
    }),
    field('gciclubfoot__Most_Recent_Treatment_Right__c', (state) => {
      const right =state.data.properties.r_treatment;
       var capRight = '';
       if (typeof right==='undefined'){
         capRight='';
       } else {
         capRight=right.charAt(0).toUpperCase() + right.slice(1);
       }
      return capRight;
    }),   
    field('gciclubfoot__Abnormalities__c', (state) => {
      return state.handleMultiSelect(state, "abnormalities")
    }),
    field('gciclubfoot__Other_Abnormalities__c', dataValue('properties.abnormalities_other')),
    field('gciclubfoot__Consent_Treatment__c', humanProper(state.data.properties.consent_treatment)), // picklist
    field('gciclubfoot__Consent_Database__c', humanProper(state.data.properties.consent_included)), // picklist
    field('gciclubfoot__Consent_Photograph_Marketing__c', humanProper(state.data.properties.consent_photograph_marketing)), // picklist
    field('gciclubfoot__Consent_Photograph_Treatment__c', humanProper(state.data.properties.consent_photograph_treatment)), // picklist
    field('gciclubfoot__Diagnosis__c', humanProper(state.data.properties.diagnosis)), // picklist
    field('Bracing_Stage__c', dataValue('properties.bracing_stage')),
    field('gciclubfoot__Diagnosis_Idiopathic_Specified__c', (state) => {
      return state.handleMultiSelect(state, "diagnosis_idiopathic_specified")
    }),
    field('gciclubfoot__Diagnosis_Secondary_Specified__c', (state) => {
      return state.handleMultiSelect(state, "diagnosis_secondary_specified")
    }),
    field('gciclubfoot__Diagnosis_Notes__c', dataValue('properties.diagnosis_notes')),
    field('gciclubfoot__Feet_Affected__c', humanProper(state.data.properties.feet_affected)), // picklist
    field('gciclubfoot__Referral_Source__c', (state) => {
      const ref = state.data.properties.referral_source
      var source='';
        if (ref=='health_facility') {
          source='Hospital or Clinic';
        } else if (ref=='midwife') {
          source='Midwife';
        } else if (ref=='chw') {
          source='Community Health Worker';
        } else if (ref=='promotional_material') {
          source='Promotional Material';
        } else if (ref=='clubfoot_patient') {
          source='Clubfoot Patient';
        } else if (ref=='community_member') {
          source='Community Member';
        } else if (ref=='rbsk_deic') {
          source='RBSK DEIC';
        } else if (ref=='other') {
          source='Other';
        } else {
          source='Not Defined';
        }
        return source;
    }),
    field('rbsk_deic__c', dataValue('properties.referral_source_rbsk_deic')),
    field('gciclubfoot__Referral_Source_Other__c', dataValue('properties.referral_source_other')),
    field('gciclubfoot__Referral_Source_Health_Facility_Name__c', dataValue('properties.referral_source_hf')),
    field('gciclubfoot__Referral_Source_Doctor_Name__c', dataValue('properties.referral_source_doctor')),
    field('gciclubfoot__Guardian_1_First_Name__c', dataValue('properties.guardian1_first_name')),
    field('gciclubfoot__Guardian_1_Last_Name__c', dataValue('properties.guardian1_last_name')),
    field('gciclubfoot__Guardian_1_Relationship__c', humanProper(state.data.properties.guardian1_relationship)), // picklist
    field('gciclubfoot__Guardian_1_Relationship_Other__c', dataValue('properties.guardian1_relationship_other')),
    field('gciclubfoot__Guardian_1_Phone_Number_1__c', dataValue('properties.guardian1_phone1')),
    field('gciclubfoot__Guardian_1_Phone_Number_2__c', dataValue('properties.guardian1_phone2')),
    field('SMS_Opt_In__c', (state) => {
       return (state.data.properties.update_sms_opt_in == "1" ? true: false)
    }),
    field('gciclubfoot__Guardian_2_First_Name__c', dataValue('properties.guardian2_first_name')),
    field('gciclubfoot__Guardian_2_Last_Name__c', dataValue('properties.guardian2_last_name')),
    field('gciclubfoot__Guardian_2_Relationship__c', humanProper(state.data.properties.guardian2_relationship)), // picklist
    field('gciclubfoot__Guardian_2_Other_Relationship__c', dataValue('properties.guardian2_relationship_other')),
    field('gciclubfoot__Guardian_2_Phone_Number_1__c', dataValue('properties.guardian2_phone1')),
    field('gciclubfoot__Guardian_2_Phone_Number_2__c', dataValue('properties.guardian2_phone2')),
    field('gciclubfoot__Guardian_3_First_Name__c', dataValue('properties.guardian3_first_name')),
    field('gciclubfoot__Guardian_3_Last_Name__c', dataValue('properties.guardian3_last_name')),
    field('gciclubfoot__Guardian_3_Relationship__c', humanProper(state.data.properties.guardian3_relationship)), // picklist
    field('gciclubfoot__Guardian_3_Relationship_Other__c', dataValue('properties.guardian3_relationship_other')),
    field('gciclubfoot__Guardian_3_Phone_Number_1__c', dataValue('properties.guardian3_phone1')),
    field('gciclubfoot__Guardian_3_Phone_Number_2__c', dataValue('properties.guardian3_phone2')),
    field('gciclubfoot__Tenotomy_Given__c', humanProper(state.data.properties.tenotomy_given)), // picklist
    field('gciclubfoot__Tenotomy_Hospital__c', dataValue('properties.tenotomy_hospital')),
    field('gciclubfoot__Tenotomy_Provider__c', dataValue('properties.tenotomy_provider')),
    field('gciclubfoot__Tenotomy_Reason_Not_Given__c', humanProper(state.data.properties.tenotomy_reason_not_given)), // picklist
    field('gciclubfoot__Transfer_Date__c', (state) => {
      const validDate = state.data.properties.transfer_date
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
     field('gciclubfoot__Stopped_Treatment_Reason_Other__c', dataValue('properties.stop_reason_other')),
    field('gciclubfoot__Tribe_Ethnicity__c', humanProper(state.data.properties.tribe_ethnicity)),
    field('Dropout__c', (state) => {
      return(state.data.properties.dropout == "dropout" ? true: false)
    }),
    field('gciclubfoot__Clinic_Transferred_To__c', dataValue('properties.transfer_clinic')),
    field('gciclubfoot__Case_Closed_by_Username_CommCare__c', dataValue('properties.closed_by_username')),
    field('gciclubfoot__Opened_Date_CommCare__c', (state) => {
      const validDate = state.data.properties.date_opened
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Opened_By_Username_CommCare__c', dataValue('properties.opened_by_username')),
    field('gciclubfoot__Last_Modified_Date_CommCare__c', (state) => {
      const validDate = state.data.date_modified
      return ( validDate ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Last_Modified_By_Username_CommCare__c', dataValue('properties.last_modified_by_username')),
    field('gciclubfoot__Case_Closed_Date_CommCare__c', (state) => {
      const validDate = state.data.date_closed
      return ( validDate != null ? new Date(validDate).toISOString() : null )
    }),
    field('gciclubfoot__Reason_Stopped_Treatment__c', humanProper(state.data.properties.close_reason)), // picklist
    field('gciclubfoot__ICR_ID__c', dataValue('properties.patient_original_id')),
    field('gciclubfoot__Owner_Name_CommCare__c', dataValue('owner_name')),
    field('Duplicate_Patient__c', (state) => {
       return (state.data.properties.duplicate_patient == "1" ? true : false)
    }),
    field('gciclubfoot__Treatment_Completed__c', (state) => {
      return (state.data.properties.treatment_completed == "1" ? true : false)
    })
  )
);
