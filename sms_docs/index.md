## Automated SMS scheduling

OpenFn integrates CommCare and the Infobip SMS Gateway so that when a CommCare form update is received in OpenFn the solution schedules in Infobip relevant SMS alerts to be sent or canceled.

# (1) Overview

This CommCare 'casting' treatment case update sends a notification to OpenFn (see example here). This would trigger OpenFn to update data in Salesforce, as well as trigger 4 SMSs for this scenario: 
treatment: “casting”; send_sms: “on”, sms_opt_in: “yes” -> schedule Casting Introduction SMS 
treatment: “casting”; send_sms: “on”, sms_opt_in: “yes” -> schedule Casting Campaign SMS
Next_visit_date <> null → schedule before next_visit_date → Reminder: 1 day before visit SMS
Next_visit_date <> null → schedule before next_visit_date → Reminder: 2 days before visit SMS

# (2) Integrations with Systems

Flow 1 CommCare form submission -> message scheduling on Infobip API
1. CommCare CAST form submissions forwarded to OpenFn inbox
2. [Infobip API](http://portal.infobip.com)

Flow 2. Bulk fetch from CommCare API
1. [CommCare API v0.5](https://www.commcarehq.org/a/miraclefeet/api/v0.5/form/)

# (3) Data flows

2 jobs have implemented to automatically schedule SMS alerts in Infobip and to fetch manually updated forms from CommCare.

Flow 1. Schedule/reschedule/cancel SMS-s in Infobip based on incoming CommCare form submissions (see [data flow diagram](https://lucid.app/lucidchart/invitations/accept/147f73b6-b863-45da-afe9-7ca220381676))
1. scheduleSMS.js analyses the incoming form submission from CommCare and connects to the Infobip API to schedule/reschedule/cancel relevant SMS alerts.

Flow 2. Periodically bulk fetch cleaned CommCare form submissions and send them to OpenFn inbox to run Flow 1 on.
`getForms.js` connects to the CommCare API to fetch submissions from CAST, analyses them to determine whether they were cleaned (determined by whether there is a difference in YYYY-MM-DD-mm between `receieved_date` and `server_modified_date`)

# (4) Automation triggers

Flow 1. Trigger type: Message Filter. Each time a form submission that includes `form.calcs.sms` arrives to the OpenFn inbox, we run scheduleSMS.js
Every time a message containing `form.calcs.sms` arrives, [detail requests]

Flow 2. Trigger type: Cron Timer. `getForms.js` bulk fetches form submissions at 10PM UTC on the first day of every month.

# (5) Solution details

[See this document](https://docs.google.com/spreadsheets/d/1quhQJgQkVRC8oObDzkwgnnm-Rov5BGOW85I4YqcNV0I/edit?usp=sharing) for the list of SMS alerts, scheduling conditions, timings and translations.

# (6) Administration

Adding/changing message text and translations can be done by:
1. Editing the message text in the translations document
2. Copying and pasting the sheet to https://csvjson.com/csv2json
3. Use the `json` output from the above applicaton to update the [`schedule_sms.js`] job(https://github.com/OpenFn/Miracle-Feet/blob/7e03d51ac07fa097f21bbaa8c3575a90a2f8f917/schedule_sms.js#L3)



