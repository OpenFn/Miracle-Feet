// =============================================================================
// Upsert Patient records in Salesforce from patient case updates in Commcare.
// test, feb 7th
// Need to add in relationship to clinic 
// =============================================================================
upsert("gciclubfoot__Patient__c", "gciclubfoot__CAST_Patient_ID__c", fields(
  field('gciclubfoot__CAST_Patient_ID__c', dataValue('properties.patient_id')),
  field('gciclubfoot__Secondary_ID__c', dataValue('properties.secondary_id')),
  field('gciclubfoot__Secondary_ID_Type__c', dataValue('properties.secondary_id_type')),
  field('gciclubfoot__Registration_Date__c', dataValue('properties.registration_date')),
  field('gciclubfoot__Clinic__c' 'Patients__r', dataValue('properties.hospital_code')),
  field('gciclubfoot__First_Name__c', dataValue('properties.patient_first_name')),
  field('gciclubfoot__Last_Name__c', dataValue('properties.patient_last_name')),
  field('gciclubfoot__Gender__c', dataValue('properties.patient_gender')), //picklist. Values in SF = Female, Male. Will need some reformmating of CC data
  field('gciclubfoot__Date_of_Birth_Known__c', dataValue('properties.patient_dob_known')),
  field('gciclubfoot__Date_of_Birth__c', dataValue('properties.patient_dob')),
  field('gciclubfoot__Location_Level_1__c', dataValue('properties.location_level1')),
  field('gciclubfoot__Location_Level_2__c', dataValue('properties.location_level2')),
  field('gciclubfoot__Street__c', dataValue('properties.location_level3')),
  field('gciclubfoot__Zip_Code__c', dataValue('properties.pin_code')),
  field('gciclubfoot__Abnormalities__c', dataValue('properties.abnormalities')),//SF Multi-Select PL. Values need to be reformatted
  field('gciclubfoot__Other_Abnormalities__c', dataValue('properties.abnormalities_other')),
  field('gciclubfoot__Consent_Treatment__c', dataValue('properties.consent_treatment')),//SF Picklist Yes/No
  field('gciclubfoot__Consent_Database__c', dataValue('properties.consent_included')), //SF Picklist Yes/No
  field('gciclubfoot__Consent_Photograph_Marketing__c', dataValue('properties.consent_photograph_marketing')), //SF Picklist Yes/No
  field('gciclubfoot__Consent_Photograph_Treatment__c', dataValue('properties.consent_photograph_treatment')), //SF Picklist Yes/No
  field('gciclubfoot__Diagnosis__c', dataValue('properties.diagnosis')),//picklist
  field('gciclubfoot__Diagnosis_Idiopathic_Specified__c', dataValue('properties.diagnosis_idiopathic_specified')),//SF Multi-select
  field('gciclubfoot__Diagnosis_Secondary_Specified__c', dataValue('properties.diagnosis_secondary_specified')),//SF multi-select
  field('gciclubfoot__Diagnosis_Notes__c', dataValue('properties.diagnosis_notes')),
  field('gciclubfoot__Feet_Affected__c', dataValue('properties.feet_affected')),//SF picklist
  field('gciclubfoot__Referral_Source__c', dataValue('properties.referral_source')), //SF picklist
  field('gciclubfoot__Referral_Source_Other__c	', dataValue('properties.referral_source_other')),
  field('gciclubfoot__Referral_Source_Health_Facility_Name__c', dataValue('properties.referral_source_health_facility')),
  field('gciclubfoot__Referral_Source_Doctor_Name__c', dataValue('properties.referral_source_doctor')),
  field('Guardian 1 Name', dataValue('properties.guardian1_name')),
  field('Guardian 1 Relationship', dataValue('properties.guardian1_relationship')),
  field('Guardian 1 Other Relationship ', dataValue('properties.guardian1_relationship_other')),
  field('Guardian 1 Phone 1', dataValue('properties.guardian1_phone1')),
  field('Guardian 1 Phone 2', dataValue('properties.guardian1_phone2')),
  field('Guardian 2 Name', dataValue('properties.guardian2_name')),
  field('Guardian 2 Relationship', dataValue('properties.guardian2_relationship')),
  field('Guardian 2 Other Relationship', dataValue('properties.guardian2_relationship_other')),
  field('Guardian 2 Phone 1', dataValue('properties.guardian2_phone1')),
  field('Guardian 2 Phone 2', dataValue('properties.guardian2_phone2')),
  field('Guardian 3 Name', dataValue('properties.guardian3_name')),
  field('Guardian 3 Relationship', dataValue('properties.guardian3_relationship')),
  field('Guardian 3 Other Relationship', dataValue('properties.guardian3_relationship_other')),
  field('Guardian 3 Phone 1', dataValue('properties.guardian3_phone1')),
  field('Guardian 3 Phone 2', dataValue('properties.guardian3_phone2')),
  field('Next Visit Date', dataValue('properties.next_visit_date')),
  field('Date Patient Transferred', dataValue('properties.transfer_date')),
  field('Clinic Transferred To', dataValue('properties.transfer_clinic')),
  field('Mobile User Patient Closed By in CAST', dataValue('properties.closed_by_username')),
  field('Date Patient Case Opened in CAST', dataValue('properties.opened_date')),
  field('Mobile User Patient Created By in CAST', dataValue('properties.opened_by_username')),
  field('Date Patient Last Modified in CAST', dataValue('properties.last_modified_date')),
  field('Last Modified By User Name', dataValue('properties.last_modified_by_username')),
  field('Date Patient Case Closed in CAST', dataValue('properties.closed_date')),
  field('Reason Patient Case Closed', dataValue('properties.close_reason')),
  field('CommCare Case ID', dataValue('properties.caseid')),
  field('Next Contact Date', dataValue('properties.next_contact_date')),
  field('Age First Brace', dataValue('properties.age_first_brace')),
  field('Date Stopped Treatment', dataValue('properties.stop_date')),
  field('Reason Stopped Treatment', dataValue('properties.stop_reason')),
  field('Reason Stopped Treatment Other', dataValue('properties.stop_reason_other'))
))
