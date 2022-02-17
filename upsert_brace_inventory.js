//Get Partner clinic id from Patient's clinic
query(
  `SELECT Account.ParentId FROM Contact 
  WHERE CommCare_Case_ID__c = '${dataValue('form.case.@case_id')(state)}'`
);

fn(state => ({
  ...state,
  data: {
    ...state.data,
    parentClinicId: state.references[0].records[0].Account.ParentId,
  },
}));

//Then get related Partner Brace Inventory
query(
  state => `SELECT Id FROM Partner_Brace_Inventory__c 
  WHERE Partner__c = '${state.data.parentClinicId}'
  AND Active__c = TRUE 
  LIMIT 1` //Returns active PBI record
);

fn(state => ({
  ...state,
  data: {
    ...state.data,
    inventoryId: state.references[0].records[0].Id,
    //save id of Partner_Brace_Inventory__c to map later
  },
}));

fn(state => {
  //NOTE: Here we add functions for converting/transformating data

  const braceMap = {
    dobbs_or_mitchell: 'Dobbs or Mitchell',
    iowa: 'Iowa',
    miraclefeet: 'MiracleFeet',
    steenbeek: 'Steenbeek',
    other: 'Other',
    ankle_foot_orthosis_afo: 'Ankle Foot Orthosis (AFO)',
  };
  
  //Added By Beth
  const discardedClinics = [
    'test_bangladesh',
    'bol_test',
    'brazil_test',
    'cam_test',
    'bong_test',
    'brazzaville_test',
    'ecu_test',
    'Facorc_test',
    'gambia_test',
    'gambia_test_clinic',
    'guat_test',
    'guinea_test_clinic',
    'hon_test',
    'uptest',
    'indonesia_test',
    'test',
    'majunga_test_clinic',
    'madagascar_test',
    'morocco_test',
    'morocco_test_clinic',
    'mya_test',
    'nepal_test',
    'nica_prueba',
    'nigeria_test',
    'nigeria_test_clinic',
    'par_test',
    'philippines_test',
    'sl_test',
    'test_som',
    'ss_test',
    'sri_lanka_test',
    'test_tanzania_clinic',
    'test_uganda_clinic',
    'test_clinic1',
    'TestMAJ01',
    'senegal_test_clinic',
    'uganda_test_clinic',
    'mali_test',
    'bangladesh_test_clinic',
    'bolivia_test_clinic',
    'brazil_test_clinic',
    'cambodia_test_clinic',
    'congo_test_clinic',
    'ecuador_test_clinic',
    'gautemala_test_clinic',
    'guinea_test_clinic',
    'honduras_test_clinic',
    'india_test_clinic',
    'indonesia_test_clinic',
    'liberia_test_clinic',
    'madagascar_test_clinic',
    'mali_test_clinic',
    'morocco_test_clinic',
    'myanmar_test_clinic',
    'nepal_test_clinic',
    'nicaraugua_test_clinic',
    'nigeria_test_clinic',
    'test_nigeria',
    'paraguary_test_clinic',
    'phillipines_test_clinic',
    'senegal_test_clinic',
    'sierra_leone_test_clinic',
    'somalia_test_clinic',
    'south_sudan_test_clinic',
    'sri_lanka_test_clinic',
    'tanzania_test_clinic',
    'uganda_test_clinic',
    'test_clinic1',
    'test_clinic2',
    'test_clinic3',
    'test_clinic4',
    'haiti_test_clinic',
    'sierra_leone_test_clinic',
    'mali_test_clinic',
  ];

  return { ...state, braceMap };
});

//NOTE: Here we upsert our target object in Salesforce & define mappings
upsertIf(
  state.data.form.subcase_0.case.update.brace_type &&
    state.data.form.subcase_0.case.update.brace_type !== '', //only upsert if brace_type is defined
  'Partner_Brace_Distribution__c',
  'CommCare_Case_ID__c',
  fields(
    field('CommCare_Case_ID__c', dataValue('id')), //make the form Id the uid for this object
    // Old uid for Visit upserts
    // field('New_Visit_UID__c', state => {
    //   var icrId = state.data.form.subcase_0.case.update.visit_original_id;
    //   var caseId = state.data.form.subcase_0.case['@case_id'];
    //   return icrId && icrId !== '' ? icrId : caseId;
    // }),
    
    relationship(
      'Patient__r',
      'CommCare_Case_ID__c',
      dataValue('form.case.@case_id')
    ),
    field('Brace_Type__c', state => {
      const ref = state.data.form.subcase_0.case.update.brace_type;
      return !ref
        ? state.data.form.brace.brace_type_india
        : ref
        ? state.braceMap[ref]
        : 'Not Defined';
    }),
    field('Partner_Brace_Inventory__c', dataValue('inventoryId')),
    field(
      'Brace_Given__c',
      dataValue('form.subcase_0.case.update.miraclefeet_brace_given')
    ),
    field(
      'Bar_Condition__c',
      dataValue('form.subcase_0.case.update.miraclefeet_bar_condition')
    ),
    field(
      'Shoe_Condition__c',
      dataValue('form.subcase_0.case.update.miraclefeet_shoes_condition')
    ),
    field(
      'Bar_Size__c',
      dataValue('form.subcase_0.case.update.miraclefeet_bar_size')
    ),
    field('Shoe_Size__c', state => {
      const mf_shoe =
        state.data.form.subcase_0.case.update.miraclefeet_shoe_size;
      const mf_brace = state.data.form.brace.miraclefeet_brace;
      var shoe = '';
      if (typeof mf_brace === 'undefined' && typeof mf_shoe === 'undefined') {
        shoe = '';
      } else if (
        typeof mf_brace.miraclefeet_shoe_size_india === 'undefined' &&
        typeof mf_shoe === 'undefined'
      ) {
        shoe = '';
      } else if (typeof mf_brace.miraclefeet_shoe_size_india === 'undefined') {
        shoe = mf_shoe;
          //mf_shoe.charAt(0).toUpperCase() + mf_shoe.slice(1).replace('_', ' ');
      } else {
        shoe = mf_brace; 
          // mf_brace.miraclefeet_shoe_size_india.charAt(0).toUpperCase() +
          // mf_brace.miraclefeet_shoe_size_india.slice(1).replace('_', ' ');
      }
      return shoe;
    }),
    field('visit_date__c', state => {
      var date = dataValue('form.case.update.visit_date')(state);
      return date && date!=='' ? new Date(date).toISOString() : date; 
    })
  )
);
