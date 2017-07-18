upsert("clinic__c", "uuid__c", fields(
  field("uuid__c", dataValue("caseId")),
  field("name__c", dataValue("case-name"))
));
