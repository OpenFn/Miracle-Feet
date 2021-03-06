## Automated SMS scheduling

OpenFn integrates CommCare and the Infobip SMS Gateway so that when a CommCare form update is received in OpenFn the solution schedules in Infobip relevant SMS alerts to be sent or canceled for patients.

# (1) Overview

Two workflows have been implemented to allow for automated SMS scheduling.

_**Flow 1**_: A CommCare form submission sends a notification to OpenFn which triggers relevant SMS-s to be scheduled in Infobip. 

**Example scenario**

[This](https://github.com/OpenFn/Miracle-Feet/blob/master/sample_data/log_visit_details_original_treatment.json) sample CommCare 'casting' treatment case update sends a notification to OpenFn (see example here). This would trigger OpenFn to schedule the following SMSs for this scenario: 

treatment: “bracing_day”; send_sms: “on”, sms_opt_in: “yes”, sms_opt_in_educational: "yes" -> schedule "06 - Bracing Introduction" SMS alerts 
treatment: “bracing_day”; send_sms: “on”, sms_opt_in: “yes”, sms_opt_in_educational: "yes" -> schedule "07 - Bracing All Day Campaign" SMS alerts
next_visit_date <> null → schedule before next_visit_date → schedule "14 - Reminder: 2 days before visit" SMS alerts

_**Flow 2**_: OpenFn bulk fetches manually cleaned CommCare form submissions and sends them to the OpenFn inbox.

# (2) Integrations with Systems

**APIs** implemented

Flow 1. CommCare form submission -> message scheduling on Infobip API
1. CommCare CAST form submissions forwarded to OpenFn inbox
2. [Infobip API](http://portal.infobip.com)

Flow 2. Bulk fetch from CommCare API
1. [CommCare API v0.5](https://www.commcarehq.org/a/miraclefeet/api/v0.5/form/)

**OpenFn adaptors** implemented

[`language-http`](https://github.com/OpenFn/language-http)

# (3) Data flows

2 jobs have been implemented to automatically schedule SMS alerts in Infobip and to fetch manually updated forms from CommCare.

Flow 1. Schedule/reschedule/cancel SMS-s in Infobip based on incoming CommCare form submissions (see [data flow diagram](https://lucid.app/lucidchart/invitations/accept/147f73b6-b863-45da-afe9-7ca220381676))
`scheduleSMS.js` analyses the incoming form submission from CommCare and connects to the Infobip API to schedule/reschedule/cancel relevant SMS alerts.

Flow 2. Periodically bulk fetch cleaned CommCare form submissions and send them to OpenFn inbox to run Flow 1 on.
`getForms.js` connects to the CommCare API to fetch submissions from CAST, analyses them to determine whether they were cleaned (determined by whether there is a difference in YYYY-MM-DD-mm between `received_date` and `server_modified_date`)

# (4) Automation triggers

Flow 1. Trigger type: Message Filter. Each time a form submission that includes `form.calcs.sms` arrives to the OpenFn inbox, we run scheduleSMS.js

Flow 2. Trigger type: Cron Timer. `getForms.js` bulk fetches form submissions at 10PM UTC on the first day of every month.

# (5) Solution details

[See this document](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?usp=sharing) for the list of SMS alerts, scheduling conditions, timings and translations.

# (6) Administration

Adding/changing message text and translations can be done by:
1. Editing the message text in the translations document
2. Copying and pasting the sheet to https://csvjson.com/csv2json
3. Use the `json` output from the above applicaton to update the [`schedule_sms.js`] job(https://github.com/OpenFn/Miracle-Feet/blob/7e03d51ac07fa097f21bbaa8c3575a90a2f8f917/schedule_sms.js#L3)

If you have question or need troubleshooting support contact **support@openfn.org**.



