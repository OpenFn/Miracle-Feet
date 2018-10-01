# Miracle Feet: CommCare to Salesforce
Jobs for Miracle Feet's CommCare to Salesforce integration, using the Open Function platform.

**N.B., all changes to the `master` branch will be automatically deployed to Open Function.**

## Notes
1. These jobs receive case, location, and form data from CommCare and perform upserts on related business objects in Salesforce in real time.
2. We're considering allowing a single job to load data to a variety of different SF instances—making Miracle Feet's OpenFn project effectively a router for various CommCare-Salesforce implementations.

note: we must update the sample data.


note: `field('gciclubfoot__Brace_Problems__c', humanProper(state.data.properties.brace_problems)),` will work for new language-common version
