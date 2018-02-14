// =============================================================================
// Upsert Patient records in Salesforce from patient case updates in Commcare.
// Need to add in relationship to clinic 
// =============================================================================
upsert("gciclubfoot__Patient__c", "gciclubfoot__CommCare_Case_ID__c", fields(
  field('gciclubfoot__CommCare_Case_ID__c', dataValue('properties.caseid')), 
  relationship('gciclubfoot__Clinic__r', "gciclubfoot__CAST_Location_ID__c", dataValue('indices.parent.location_id')),
  field('gciclubfoot__CAST_Patient_ID__c', dataValue('properties.patient_id')),
  field('gciclubfoot__Age_Months_First_Brace__c', dataValue('properties.age_months_first_brace_rounded')),
  field('gciclubfoot__Age_Months_Started_Treatment__c	', dataValue('properties.age_months_start_treatment_rounded')),
  field('gciclubfoot__Secondary_ID__c', dataValue('properties.secondary_id')),
  field('gciclubfoot__Secondary_ID_Type__c', dataValue('properties.secondary_id_type')),
  field('gciclubfoot__Registration_Date__c', dataValue('properties.registration_date')),
  field('gciclubfoot__Clinic__c' 'Patients__r', dataValue('properties.hospital_code')),
  field('Name', dataValue('properties.name')),
  field('gciclubfoot__First_Name__c', dataValue('properties.patient_first_name')),
  field('gciclubfoot__Last_Name__c', dataValue('properties.patient_last_name')),
  field('gciclubfoot__Gender__c', dataValue('properties.patient_gender')), //picklist. Female, Male
  field('gciclubfoot__Date_of_Birth_Known__c', dataValue('properties.patient_dob_known')), //picklist Yes, No
  field('gciclubfoot__Date_of_Birth__c', dataValue('properties.patient_dob')),
  field('gciclubfoot__Location_Level_1__c', dataValue('properties.location_level1_name')),
  field('gciclubfoot__Location_Level_2__c', dataValue('properties.location_level2_name')),
  field('gciclubfoot__City_Town__c', dataValue('properties.location_level3')),       
  field('gciclubfoot__Street__c', dataValue('properties.patient_address')),
  field('gciclubfoot__Zip_Code__c', dataValue('properties.pin_code')),
  field('gciclubfoot__Abnormalities__c', dataValue('properties.abnormalities')),//SF Multi-Select PL Values = No Abnormalities, Lower Extremities, Upper Extremities, Hips, Spine, Head, Heart, Lungs, Urinary, Digestive, Skin, Neurological, Other
  field('gciclubfoot__Other_Abnormalities__c', dataValue('properties.abnormalities_other')),
  field('gciclubfoot__Consent_Treatment__c', dataValue('properties.consent_treatment')),//SF Picklist Yes/No
  field('gciclubfoot__Consent_Database__c', dataValue('properties.consent_included')), //SF Picklist Yes/No
  field('gciclubfoot__Consent_Photograph_Marketing__c', dataValue('properties.consent_photograph_marketing')), //SF Picklist Yes/No
  field('gciclubfoot__Consent_Photograph_Treatment__c', dataValue('properties.consent_photograph_treatment')), //SF Picklist Yes/No
  field('gciclubfoot__Diagnosis__c', dataValue('properties.diagnosis')),//picklist Idiopathic, Secondary, Postural  
  field('gciclubfoot__Diagnosis_Idiopathic_Specified__c', dataValue('properties.diagnosis_idiopathic_specified')),//SF Multi-select Untreated (Under 2), Neglected (Over 2), Resistant, Recurrent, Aytpical, Complex
  field('gciclubfoot__Diagnosis_Secondary_Specified__c', dataValue('properties.diagnosis_secondary_specified')),//SF multi-select Syndromic, Spina Bifida, Arthrogryposis, Other Neuropathic
  field('gciclubfoot__Diagnosis_Notes__c', dataValue('properties.diagnosis_notes')),
  field('gciclubfoot__Feet_Affected__c', dataValue('properties.feet_affected')),//SF picklist Right, Left, Both
  field('gciclubfoot__Referral_Source__c', dataValue('properties.referral_source')), //SF picklist Clubfoot Patient, Community Health Worker, Community Member, Hospital or Clinic, Midwife, Promotional Material, Other
  field('gciclubfoot__Referral_Source_Other__c	', dataValue('properties.referral_source_other')),
  field('gciclubfoot__Referral_Source_Health_Facility_Name__c', dataValue('properties.referral_source_health_facility')),
  field('gciclubfoot__Referral_Source_Doctor_Name__c', dataValue('properties.referral_source_doctor')),
  field('gciclubfoot__Guardian_1_First_Name__c', dataValue('properties.guardian1_first_name')),
  field('gciclubfoot__Guardian_1_Last_Name__c', dataValue('properties.guardian1_last_name')),
  field('gciclubfoot__Guardian_1_Relationship__c', dataValue('properties.guardian1_relationship')),//picklist Mother, Father, Grandmother, Grandfather, Other Relative, Friend, Other
  field('gciclubfoot__Guardian_1_Relationship_Other__c', dataValue('properties.guardian1_relationship_other')),
  field('gciclubfoot__Guardian_1_Phone_Number_1__c', dataValue('properties.guardian1_phone1')),
  field('gciclubfoot__Guardian_1_Phone_Number_2__c', dataValue('properties.guardian1_phone2')),
  field('gciclubfoot__Guardian_2_First_Name__c', dataValue('properties.guardian2_first_name')),
  field('gciclubfoot__Guardian_2_Last_Name__c', dataValue('properties.guardian2_last_name')),
  field('gciclubfoot__Guardian_2_Relationship__c', dataValue('properties.guardian2_relationship')),//picklist Mother, Father, Grandmother, Grandfather, Other Relative, Friend, Other
  field('gciclubfoot__Guardian_2_Relationship_Other__c', dataValue('properties.guardian2_relationship_other')),
  field('gciclubfoot__Guardian_2_Phone_Number_1__c', dataValue('properties.guardian2_phone1')),
  field('gciclubfoot__Guardian_2_Phone_Number_2__c', dataValue('properties.guardian2_phone2')),
  field('gciclubfoot__Guardian_3_First_Name__c', dataValue('properties.guardian3_first_name')),
  field('gciclubfoot__Guardian_3_Last_Name__c', dataValue('properties.guardian3_last_name')),
  field('gciclubfoot__Guardian_3_Relationship__c', dataValue('properties.guardian3_relationship')), //picklist Mother, Father, Grandmother, Grandfather, Other Relative, Friend, Other
  field('gciclubfoot__Guardian_3_Relationship_Other__c', dataValue('properties.guardian3_relationship_other')),
  field('gciclubfoot__Guardian_3_Phone_Number_1__c', dataValue('properties.guardian3_phone1')),
  field('gciclubfoot__Guardian_3_Phone_Number_2__c', dataValue('properties.guardian3_phone2')),
  field('gciclubfoot__Transfer_Date__c', dataValue('properties.transfer_date')),
  field('gciclubfoot__Clinic_Transferred_To__c', dataValue('properties.transfer_clinic')),
  field('gciclubfoot__Case_Closed_by_Username_CommCare__c', dataValue('properties.closed_by_username')),
  field('gciclubfoot__Opened_Date_CommCare__c', dataValue('properties.opened_date')),
  field('gciclubfoot__Opened_By_Username_CommCare__c', dataValue('properties.opened_by_username')),
  field('gciclubfoot__Last_Modified_Date_CommCare__c', dataValue('properties.last_modified_date')),
  field('gciclubfoot__Last_Modified_By_Username_CommCare__c', dataValue('properties.last_modified_by_username')),
  field('gciclubfoot__Case_Closed_Date_CommCare__c', dataValue('properties.closed_date')),
  field('gciclubfoot__Reason_Stopped_Treatment__c', dataValue('properties.close_reason')), //picklist Treatment Complete, Moved, Family Refuses Treatment, Family Stopped Coming, Death, Duplicate Patient Record, Other Reason 
  field('gciclubfoot__CommCare_Case_ID__c', dataValue('properties.caseid')),
  field('gciclubfoot__ICR_ID__c', dataValue('properties.patient_original_id')),
  field('gciclubfoot__Owner_Name_CommCare__c', dataValue('owner_name')),
  field('gciclubfoot__Treatment_Completed__c', dataValue('treatment_completed')), //checkbox SF; 0 and 1 CommCare 
 
 
  
))
