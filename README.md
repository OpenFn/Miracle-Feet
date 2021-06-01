# MiracleFeet OpenFn Integrations
Jobs for Miracle Feet's CommCare to Salesforce integration, using the Open Function platform. [See the MiracleFeet India](https://github.com/OpenFn/miraclefeet-india) repository for more on the India CAST app integration. 

**N.B., all changes to the `master` branch will be automatically deployed to Open Function.**

## 1. CommCare-Salesforce Integration for Automated Data Sync
MiracleFeet has configured CommCare to deliver the "CAST" application to support partner treatment providers and service delivery across 26 countries. [Read more here](). 

MiracleFeet has implemented OpenFn to automate one-way data integration between CAST (CommCare) and the MF Global System (Salesforce) for real-time monitoring and reporting across CommCare form submissions and case updates. 

### Technical Overview
How it works...
1. Users submit new `forms` or modify `cases` in CommCare
2. A webhook configured in the CommCareHQ project automatically forwards this data to MiracleFeet's OpenFn project `Inbox` as `Messages`
3. OpenFn jobs are triggered to process & upload this CommCare data to Salesforce
- [Add New Patient_V2](https://www.openfn.org/projects/pdbznd/jobs/jyxr79)
- [Update Patient_V2](https://www.openfn.org/projects/pdbznd/jobs/jyjaqq)
- [Add New Visit_V2](https://www.openfn.org/projects/pdbznd/jobs/jv8m7n)
- [Update Visit_V2](https://www.openfn.org/projects/pdbznd/jobs/jvrz7p)
- [Upsert Clinic_V2](https://www.openfn.org/projects/pdbznd/jobs/jv9bmk)

### Job Notes
1. These jobs receive case, location, and form data from CommCare and perform upserts on related business objects in Salesforce in real time.
2. We're considering allowing a single job to load data to a variety of different SF instances—making Miracle Feet's OpenFn project effectively a router for various CommCare-Salesforce implementations.
3. Mappings that use `humanProper(...)` (e.g.,`field('gciclubfoot__Brace_Problems__c', humanProper(state.data.properties.brace_problems)),`) will work for new language-common version. 

### Support 
MiracleFeet global administrators are responsible for integration monitoring & reprocessing of any failed runs. [See here]() for MF's troubleshooting guide. For additional OpenFn support, users may contact support@openfn.org. 

## 2. CommCare-Infobip Integration for Automated SMS Alerts
Watch the [solution overview video](https://drive.google.com/file/d/1Ne7sHJ8BR1I3Emqf01jiyFI1kp1WArnM/view?usp=sharing) for the CommCare-Infobip SMS integration for patient visit reminders and educational SMSs. [See here](https://lucid.app/lucidchart/9454d9ca-7c35-482d-b9e9-0e41284d1281/edit?page=0_0#) for the data flow diagrams. 

And [see here](https://docs.google.com/document/d/1FHJIW8bAQYk-4WP3uosoCCVvXVTTPPIej64N7_L-lSY/edit?usp=sharing) for the original project concept. 

### Technical Overview
How it works...
1. Users submit new `forms` or modify `cases` in CommCare
2. A webhook configured in the CommCareHQ project automatically forwards this data to MiracleFeet's OpenFn project `Inbox` as `Messages`
3. OpenFn job [`Schedule SMS Alerts`](https://www.openfn.org/projects/pdbznd/jobs/jypnkm) will be triggered to schedule relevant SMS alerts in the Infobip Portal

### Notes on Scheduling Logic

**Overview**

1. SMS-s are scheduled in Infobip using constructed `bulkId`-s. `bulkId` are constructed from the alert ID (e.g. `casting_intro-1` and the CommCare `case_id`: `casting_intro-1-XXX`. They are used to uniquely identify SMS-s in Infobip. 
2. SMS-s are scheduled using `upsert` logic in Infobip: when scheduling or deleting an SMS, OpenFn first checks if an SMS with the corresponding `bulkId` has already been scheduled for the future or already sent. If this is the case, no changes are made. If the SMS hasn't been scheduled or sent, it gets scheduled.
3. In case of deletion, OpenFn checks if an SMS with the corresponding `bulkId` has been scheduled for the future or already sent. If it is scheduled, it gets canceled.
4. Educational SMS alerts are scheduled following the logic outlined [here](https://lucid.app/lucidchart/invitations/accept/inv_1b2fc530-9f5c-4645-a317-618a395eaa06).
5. Visit reminders and missed appointment reminders are scheduled to be sent according to the next visit date indicated in the form.
6. Detailed scheduling conditions and SMS content can be found in the [master mapping table](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?usp=sharing).
7. SMS scheduling times are adjusted for local time zones.
8. SMS-s are only scheduled to be sent between 8am-8pm local time.


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

**Opt-in, opt-out**

- Opting in to receiving SMS-s: `send_sms = 'on'`
- Opting in to receive educational messages: `sms_opt_in_educational = 'yes'`
- Opting in to receive visit reminders: `sms_opt_in = 'yes'`

**Treatment changes, stopping treatment**

When a patient is marked as stopped, suspended or completed treatment, they will no receive educational messages and visit reminders. If they move from one treatment to a different one, educational messages for the original treatment are stopped and SMS campaign for the new treatment is scheduled.

### Ongoing Management

To update SMS scheduling times, SMS templates, SMS language codes, or add new translations:
1. Make a copy of the [Master Mapping Table](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?ts=606433e3#gid=262234774)).
2. Make your edits in the new sheet (see an example [here](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?ts=606433e3#gid=179313688).
3. Notify OpenFn support at support@openfn.org to implement the changes.

To add/remove alerts or reminders, update CommCare field names, change opt-in/opt-out conditions, add new CommCare forms that trigger SMS-s, or any other change, contact support@openfn.org.

### Training

Administrator Training [Slides](https://docs.google.com/presentation/d/1b00y9VBgJ5zDjuRAuwMWBrnrlkypx4Wqvo0TQu6Pfdg/edit?usp=sharing)
Change Management Training [Slides](https://docs.google.com/presentation/d/1chirtiqxa2LRrxl5g2o2D6vT8aCAQsWIJ1DoITzI5_A/edit?usp=sharing)

### SMS Implementation Next Steps 
- [ ] Finish testing across countries to sign-off on alert scheduling logic & content. [See Test Suite](https://docs.google.com/spreadsheets/d/1ZR60vDaejfWva5lkLXn2o362vpqLX0RWwW31Na3l9hg/edit?usp=drive_web&ouid=101430720901034004945) for detailed unit tests. 
- [ ] Remove code in OpenFn job that executes flow only for test users
- [ ] Confirm all Infobip sender IDs are correct
- [ ] System admin training on solution management 
- [ ] ...
