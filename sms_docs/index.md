## Automated SMS scheduling

OpenFn integrates CommCare and the Infobip SMS Gateway so that when a CommCare form update is received in OpenFn the solution schedules in Infobip relevant SMS alerts to be sent or canceled.

# (1) Overview

This CommCare 'casting' treatment case update sends a notification to OpenFn (see example here). This would trigger OpenFn to update data in Salesforce, as well as trigger 4 SMSs for this scenario: 
treatment: “casting”; send_sms: “on”, sms_opt_in: “yes” -> schedule Casting Introduction SMS 
treatment: “casting”; send_sms: “on”, sms_opt_in: “yes” -> schedule Casting Campaign SMS
Next_visit_date <> null → schedule before next_visit_date → Reminder: 1 day before visit SMS
Next_visit_date <> null → schedule before next_visit_date → Reminder: 2 days before visit SMS

# (2) Integrations with Systems

# (3) Data flows

2 jobs have implemented to 

Flow 1. Schedule/reschedule/cancel SMS-s based on incoming CommCare form submissions (data flow diagram)
1. scheduleSMS.js analyses the incoming form submission from CommCare and connects to the Infobip API to schedule/reschedule/cancel relevant SMS alerts.


Flow 2. Periodically bulk fetch cleaned CommCare form submissions and send them to OpenFn inbox to run Flow 1 on.
`getForms.js` connects to the CommCare API to fetch submissions from CAST, analyses them to determine whether they were cleaned (determined by whether there is a difference in YYYY-MM-DD-mm between `receieved_date` and `server_modified_date`)

# (4) Automation triggers

Flow 1. Trigger type: Message Filter. Each time a form submission that includes `form.calcs.sms` arrives to the OpenFn inbox, we run scheduleSMS.js

Flow 2. Trigger type: Cron Timer. `getForms.js` bulk fetches form submissions at 10PM UTC on the first day of every month.

# (5) Solution details

SMS timing
translations

# (6) Administration

Adding/changing message text and translations



