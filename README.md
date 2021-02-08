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
[See here]() for the project concept. 

### Technical Overview
How it works...
1. Users submit new `forms` or modify `cases` in CommCare
2. A webhook configured in the CommCareHQ project automatically forwards this data to MiracleFeet's OpenFn project `Inbox` as `Messages`
3. OpenFn job will be triggered...

### SMS Implementation Next Steps 
- [ ] Finish testing across countries to sign-off on alert scheduling logic & content
- [ ] Remove code in OpenFn job that executes flow only for test users
- [ ] Confirm all Infobip sender IDs are correct
- [ ] System admin training on solution management
- [ ] ...
