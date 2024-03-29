# MiracleFeet OpenFn Integrations
Jobs for Miracle Feet's CommCare to Salesforce integration, using the Open Function platform. [See the MiracleFeet India](https://github.com/OpenFn/miraclefeet-india) repository for more on the India CAST app integration. 

**N.B., all changes to the `master` branch will be automatically deployed to Open Function.**

## 1. CommCare-Salesforce Integration for Automated Data Sync
MiracleFeet has configured CommCare to deliver the "CAST" application to support partner treatment providers and service delivery across 26 countries. 

MiracleFeet has implemented OpenFn to automate one-way data integration between CAST (CommCare) and the MF Global System (Salesforce) for real-time monitoring and reporting across CommCare form submissions and case updates. 

### Technical Overview

1. Users submit new `forms` or modify `cases` in CommCare
2. A webhook configured in the CommCareHQ project automatically forwards this data to MiracleFeet's OpenFn project `Inbox` as `Messages`
3. OpenFn jobs are triggered to process & upload this CommCare data to Salesforce
- [Add New Patient_V2](https://www.openfn.org/projects/pdbznd/jobs/jyxr79)
- [Update Patient_V2](https://www.openfn.org/projects/pdbznd/jobs/jyjaqq)
- [Add New Visit_V2](https://www.openfn.org/projects/pdbznd/jobs/jv8m7n)
- [Update Visit_V2](https://www.openfn.org/projects/pdbznd/jobs/jvrz7p)
- [Upsert Clinic_V2](https://www.openfn.org/projects/pdbznd/jobs/jv9bmk)

![diagram](docs/high-level-job-diagram.png)


### Job Notes
1. These jobs receive case, location, and form data from CommCare and perform upserts on related business objects in Salesforce in real time.
2. We're considering allowing a single job to load data to a variety of different SF instances—making Miracle Feet's OpenFn project effectively a router for various CommCare-Salesforce implementations.
3. Mappings that use `humanProper(...)` (e.g.,`field('gciclubfoot__Brace_Problems__c', humanProper(state.data.properties.brace_problems)),`) will work for new language-common version. 

### Support 
MiracleFeet global administrators are responsible for integration monitoring & reprocessing of any failed runs. For additional OpenFn support, users may contact support@openfn.org. 

## <a id="sms-integration"></a> 2. Salesforce-Infobip Integration for Automated SMS Alerts
Originally the SMS scheduling solution relied on CommCare form updates received in the OpenFn inbox to schedule messages. 
It has been re-designed to achieve the same functionality based on patient details fetched from Salesforce.
[See here](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?viewport_loc=1072%2C355%2C597%2C297%2CSQpcRv~M.sEX&invitationId=inv_0b1e0088-9de6-43c7-8d63-01f3263cfa88) for the data flow diagrams. 

Watch the [solution overview video](https://drive.google.com/file/d/1Ne7sHJ8BR1I3Emqf01jiyFI1kp1WArnM/view?usp=sharing) for the original CommCare-Infobip SMS integration for patient visit reminders and educational SMSs. 

And [see here](https://docs.google.com/document/d/1FHJIW8bAQYk-4WP3uosoCCVvXVTTPPIej64N7_L-lSY/edit?usp=sharing) for the original project concept. 

### Technical Overview
Prerequisites
Patients' Salesforce information necessary for SMS scheduling is now being synced from CommCare via the existing [Add new patient](https://github.com/OpenFn/Miracle-Feet/blob/master/add_new_patient__UPDATED.js), [Update Patient](https://github.com/OpenFn/Miracle-Feet/blob/master/update_patient_UPDATED.js), [Add new visit](https://github.com/OpenFn/Miracle-Feet/blob/master/add_new_visit__UPDATED.js) and [Update visit](https://github.com/OpenFn/Miracle-Feet/blob/master/update_visit__UPDATED.js) jobs when an update happens in CommCare. These update the new Salesforce fields: SMS Treatment, SMS Original Treatment, SMS Treatment Start Date, and the Pronoun fields. We also make use of the Patient First Name, Guardian First Name, Brace Problems Type, Last and Next Visit dates, and the Send SMS and SMS Opt In fields to create messages and verify consent. 

[Inbox Security]([url](https://docs.openfn.org/documentation/manage/platform-mgmt#inbox-security)) is set up for the projec with Basic Authentication.

How it works...
1. An OpenFn job [[SMS-Flow-1] Fetch contacts from SF](https://openfn.org/projects/miraclefeet/jobs/eZiygD) runs daily to query contacts from Salesforce and fetch their treatment and appointment information.
2. A second OpenFn job [[SMS-Flow-2] Schedule SMSs](https://openfn.org/projects/miraclefeet/jobs/QjbQti)  will be triggered to schedule relevant SMS alerts in the Infobip Portal

We have separate jobs to schedule ["Bracing Night"](#bracing-night) messages and to handle changes in [clinic status](#clinic-status).

### Data flow diagrams

A high-level overview of the SMS jobs can be found [here](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=TMAOo6WVCw0L#).

The following diagrams describe the SMS scheduling/cancelation logic for the different flows.
1. [Alerts](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=1DAwPIVNM1be#): scheduling logic for educational messages in the [[SMS-Flow-1] Fetch contacts from SF](https://openfn.org/projects/miraclefeet/jobs/eZiygD) flow. 
2. [Reminders](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=lnCwXzrVWkm-#): Appointment reminder scheduling logic in the same SMS Flow.
3. [Opt-out](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=ofMGMeZYd5CR#): SMS cancelation logic when a patient opts out of some or all of the SMS-s, handled in the same SMS flow.
4. [Deletion](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=m_LGgr65KSdJ#): Deleting SMSs for previous treatment in case the treatment has changed or stopped in the same flow.
5. [Bracing night](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=SQpcRv~M.sEX#): Logic for scheduling ["Bracing night"]((#bracing-night)) messages in the ["Bracing Night"](#bracing-night) flow. 
6. [Deactivated clinic](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=3kldohKkc3rC#): Logic for canceling all SMSs in case a clinic is deactivated, handled in the [deactivation](#clinic-status) flow.
7. [Suspended clinic](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?invitationId=inv_5ca4e2c4-7c67-456c-8282-40356440173c&page=-vZdQ7bQkd0_#): Canceling appointment reminders for suspended clinic in the [deactivation](#clinic-status) flow.

Alert IDs in the diagrams (e.g. `Alert 8`) refer to [# Alert](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?pli=1#gid=379768061&range=A:A) in the Master Mapping Table. Admins can check all information on the alert (scheduling time, condition for scheduling, SMS text and translations) in the sheet by Alert ID.

### Notes on Scheduling Logic

**Overview**

1. SMS-s are scheduled in Infobip using constructed `bulkId`-s. `bulkId` are constructed from the alert ID (e.g. `casting_intro-1` and the CommCare `case_id`: `casting_intro-1-XXX`. They are used to uniquely identify SMS-s in Infobip. 
2. SMS-s are scheduled using `upsert` logic in Infobip: when scheduling or deleting an SMS, OpenFn first checks if an SMS with the corresponding `bulkId` has already been scheduled for the future or already sent. If this is the case, no changes are made. If the SMS hasn't been scheduled or sent, it gets scheduled.
3. In case of deletion, OpenFn checks if an SMS with the corresponding `bulkId` has been scheduled for the future or already sent. If it is scheduled, it gets canceled.
4. Educational SMS alerts are scheduled following the logic outlined [here](https://lucid.app/lucidchart/invitations/accept/inv_1b2fc530-9f5c-4645-a317-618a395eaa06).
5. Visit reminders and missed appointment reminders are scheduled to be sent according to the next visit date indicated in the form. We don't send missed appointments reminders more than 1 week after the appointment date.
6. Detailed scheduling conditions and SMS content can be found in the [master mapping table](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?usp=sharing). The current Salesforce-based solution uses the [Salesforce mapping table](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit#gid=379768061). (The previous, [CommCare-based job](https://github.com/OpenFn/Miracle-Feet/blob/master/schedule_sms.js) uses a [different mapping table]([url](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit#gid=262234774)).
7. Both scheduleSMSv2 and bracing-night  jobs use the "[CURRENT] Master Mapping Table Salesforce" mapping. ScheduleSMSV2 schedules alert `8` and `9` of the bracing-night messages and all the other (non-bracing-night) alerts. The bracing-night job only schedules alerts `9B` to `9P`.
8. SMS scheduling times are adjusted for local time zones.
9. SMS-s are only scheduled to be sent between 8am-8pm local time.
10. We only schedule SMS if `Guardian_1_Phone_Landline__c == false` on the Patient's Salesforce profile.
11. Errors returned by the Infobip API for incorrect phone numbers are uploaded regularly to Contacts' SMS Error field. We only schedule SMS to patients where this is empty, and we delete scheduled alerts for Contacts that have any SMS Errors marked.
12. Due to limitations of the Infobip API, we don't schedule any messages for more than 6 months ahead.


**Logic for setting missed appointment reminders**
SMS reminders are scheduled to be sent if a patient misses an appointment they are scheduled for. This is set when a new `next_visit_date` is added. If there were alerts set for previous visits, those are canceled in Infobip.

Used values: `last_visit_date/original_next_visit_date` for previous scheduled visits, `next visit date` for next visit

*Steps*
1. Check if there’s a last visit date. If so, check if these bulkIDs have been scheduled
`visitAfter1-{form.case.@case_id}-{last_visit_date}`
`visitAfter2-{form.case.@case_id}-{last_visit_date}`
If yes, delete them.

2. Schedule the reminders with the current next visit date
`visitAfter1-{form.case.@case_id}-{next_visit_date}`
`visitAfter2-{form.case.@case_id}-{next_visit_date}`

**Scheduling a message on the Infobip API**

```
curl --location --request POST 'https://apidomain.infobip.com/sms/1/text/advanced' \
--header 'Authorization: App ${api_key}' \
--data-raw '{"bulkId": "bracing_day-6-345678", "messages":[{"from": "+111","destinations": [{"to": "+111"}],"text": "A long time ago, in a galaxy far, far away...","sendAt": "2021-12-24T18:20:00.000"}]}'
```

**Opt-in, opt-out**

- Opting in to receiving SMS-s: `Send_SMS__c = true`
- Opting in to receive educational messages: `SMS_Opt_In_II__c = true`
- Opting in to receive visit reminders: `SMS_Opt_In__c = true`

**Treatment changes, stopping treatment**

When a patient is marked as stopped, suspended or completed treatment, they will no receive educational messages and visit reminders. If they move from one treatment to a different one, educational messages for the original treatment are stopped and SMS campaign for the new treatment is scheduled.

<a id="bracing-night"></a> **Scheduling "Bracing Night" SMSs**

Since September 2021 it's not possible to schedule messages on the Infobip API for more than 6 month ahead. 

The `Bracing Night` SMS campaign runs for more than 3.5 years. We use the following process to schedule these messages:

We run the [[Bracing-night 1] Fetch bracing night contacts from SF](https://www.openfn.org/projects/pdbznd/jobs/jv9qn9) job to check on SF if there's any contact that has Bracing Night set as SMS Treatment. 

The [[Bracing-night 2] Schedule bracing night SMSs](https://www.openfn.org/projects/pdbznd/jobs/jvn5jk) will then automatically launch to schedule any necessary SMSs for the next 3 months, based on the `SMS_Treatment_Start_Date__c` field.

<a id="clinic-status"></a> [**Clinic status and SMS scheduling**](#clinic-status)

Clinic status is set in Salesforce, in the Status field.

All "Actively supported" clinics are eligible for SMS (although not all have it turned on)

We run the [[Deactivation-1] Fetch Inactive Clinics from SF](https://www.openfn.org/projects/pdbznd/jobs/jvn5rk) job daily to check for clinics that are inactive and disable SMS-s for associated patients guided by the below logic:
- "Previously Supported" and "Active - CAST Guest User Only" clinics are inactive, we cancel all SMSs for patients
- For "Temporarily Suspended" clinics we cancel patients' appointment reminders.
If clinic Status changed back to actively supported, the admin will need to re-enroll each individual in reminders.

### Ongoing Management

** To enroll a new country to SMS**
1. Turn on SMS for the CommCare user (`send_sms` field)
2. Add country to [Fetch contacts](https://www.openfn.org/projects/miraclefeet/jobs/eZiygD) and [Fetch bracing night contacts](https://openfn.org/projects/miraclefeet/jobs/jv9qn9) jobs, e.g.: `Account.Country__c in ('Nigeria', 'Uganda')`

**To update SMS scheduling times, SMS templates, SMS language codes, or add new translations:**
1. Make a copy of the [Master Mapping Table](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit#gid=379768061).
2. Make your edits in the new sheet (see an example [here](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?ts=606433e3#gid=179313688)).
3. Notify OpenFn support at support@openfn.org to implement the changes.

**Migration Checklist**

Access [here](https://docs.google.com/spreadsheets/d/13piqZCaCXUbQxyMthQnaQwfxAZhQZOKOs_79rolzu2s/edit?usp=sharing).

#### OpenFn Process for converting Mapping sheet to JSON object
1. Copy the whole content of the mapping table
2. Paste on this converter at the left pane https://csvjson.com/csv2json
3. Get the generated json
4. Paste it on [content-input.json](https://github.com/OpenFn/Miracle-Feet/blob/master/mappings/content-input.json)
5. Execute `node mappings/converter.js`
6. Copy the resulting content from content-output-minified.js https://github.com/OpenFn/Miracle-Feet/blob/master/mappings/content-output-minified.js
7. Paste it in the job in place of mapping variable at line 3. If there is code formatting enabled, it might expand the contents. In that case, undo that last change to make sure content is on one line. There are 2 jobs to update: 
1. The entire mapping sheet should be added to: https://github.com/OpenFn/Miracle-Feet/blob/master/schedule_smsV2.js
2. Only the "Bracing Night" messages to be added to: https://github.com/OpenFn/Miracle-Feet/blob/master/2.scheduleContactSMS.js

**To add/remove alerts or reminders, update CommCare field names, change opt-in/opt-out conditions, add new CommCare forms that trigger SMS-s, or any other change, contact support@openfn.org.**

SMS scheduling only happens for patients whose Clinic `Status` in Salesforce is either in "Actively Supported" or "Temporarily Suspended". In order to add or remove clinic from the scheduling flow, change the Clinic Status accordingly. **To opt a clinic into SMS alerts, this `Status` should be updated in Salesforce.**

### Training

Administrator Training [Slides](https://docs.google.com/presentation/d/1b00y9VBgJ5zDjuRAuwMWBrnrlkypx4Wqvo0TQu6Pfdg/edit?usp=sharing)  
Change Management Training [Slides](https://docs.google.com/presentation/d/1chirtiqxa2LRrxl5g2o2D6vT8aCAQsWIJ1DoITzI5_A/edit?usp=sharing)

### SMS Implementation Next Steps 
**Salesforce-based flow roll-out**
- [x] Finish testing to sign-off on alert scheduling logic. [See new test suite](https://docs.google.com/spreadsheets/d/1iWV06FjPrc2CFyoWvWr7ZVA5K8mQVWUNqNLAwJZnQ8Q/edit?pli=1#gid=121594139).
- [x] Sync `Brace Problems Type` data to patients in Salesforce
- [x] Deactivate original [Schedule SMS job](https://openfn.org/projects/miraclefeet/jobs/jypnkm)
- [x] Link[ [SMS-Flow-1] Fetch contacts from SF job](https://www.openfn.org/projects/miraclefeet/jobs/eZiygD) to [timer trigger](https://www.openfn.org/projects/miraclefeet/triggers/tyxj3d)


**Original flow roll-out**
- [x] Finish testing across countries to sign-off on alert scheduling logic & content. [See Test Suite](https://docs.google.com/spreadsheets/d/1ZR60vDaejfWva5lkLXn2o362vpqLX0RWwW31Na3l9hg/edit?usp=drive_web&ouid=101430720901034004945) for detailed unit tests. 
and the [updated test suite](https://docs.google.com/spreadsheets/d/1iWV06FjPrc2CFyoWvWr7ZVA5K8mQVWUNqNLAwJZnQ8Q/edit?pli=1#gid=121594139) for the Salesforce-Infobop integration.
- [x] Remove code in OpenFn job that executes flow only for test users
- [x] Confirm all Infobip sender IDs are correct
- [x] System admin training on solution management 
- [ ] ...
- [ ] 


