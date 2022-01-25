psert(
    'Contact',
    'CommCare_Case_ID__c',
    contact
  )(state).then(state => {
    return upsert(
      'Visit_new__c',
      'New_Visit_UID__c',
      fields(
        field('New_Visit_UID__c', state => {
          var icrId = state.data.form.subcase_0.case.update.visit_original_id;
          var caseId = state.data.form.subcase_0.case['@case_id'];
          return icrId && icrId !== '' ? icrId : caseId;
        }),
        //changed EXT ID from gciclubfoot__commcare_case_id__c as this is how it is configured in SF
        // const braceMap = {
        //   dobbs_or_mitchell: 'Dobbs or Mitchell',
        //   iowa: 'Iowa',
        //   miraclefeet: 'MiracleFeet',
        //   steenbeek: 'Steenbeek',
        //   other: 'Other',
        //   ankle_foot_orthosis_afo: 'Ankle Foot Orthosis (AFO)',
        // };
        field('Brace_Type__c', state => {
          const ref = state.data.form.subcase_0.case.update.brace_type;
          return !ref
            ? state.data.form.brace.brace_type_india
            : ref
            ? state.braceMap[ref]
            : 'Not Defined';
        }),
        field(
          'MiracleFeet_Brace_Given__c',
          humanProper(
            state.data.form.subcase_0.case.update.miraclefeet_brace_given
          )
        ), // picklist
          field(
          'Bar_Condition__c',
          humanProper(
            state.data.form.subcase_0.case.update.miraclefeet_bar_condition
          )
        ), // picklist
        field(
          'Shoe_Condition__c',
          humanProper(
            state.data.form.subcase_0.case.update.miraclefeet_shoes_condition
          )
        ), // picklist
         field(
          'Bar_Size__c',
          humanProper(
            state.data.form.subcase_0.case.update.miraclefeet_bar_size
          )
        ), // picklist
        field('Shoe_Size__c', state => {
          const mf_shoe =
            state.data.form.subcase_0.case.update.miraclefeet_shoe_size;
          const mf_brace = state.data.form.brace.miraclefeet_brace;
          var shoe = '';
          if (
            typeof mf_brace === 'undefined' &&
            typeof mf_shoe === 'undefined'
          ) {
            shoe = '';
          } else if (
            typeof mf_brace.miraclefeet_shoe_size_india === 'undefined' &&
            typeof mf_shoe === 'undefined'
          ) {
            shoe = '';
          } else if (
            typeof mf_brace.miraclefeet_shoe_size_india === 'undefined'
          ) {
            shoe =
              mf_shoe.charAt(0).toUpperCase() +
              mf_shoe.slice(1).replace('_', ' ');
          } else {
            shoe =
              mf_brace.miraclefeet_shoe_size_india.charAt(0).toUpperCase() +
              mf_brace.miraclefeet_shoe_size_india.slice(1).replace('_', ' ');
          }
          return shoe;
        }),
         field('visit_date__c', state => {
          return state.dateConverter(
            state.data.form.subcase_0.case.update.visit_date
          )})); 
        
