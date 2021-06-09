//API docs: https://confluence.dimagi.com/display/commcarepublic/List+Mobile+Workers
//== First we get users from CommCare ==================================//
get(
  'https://www.commcarehq.org/a/miraclefeet/api/v0.5/user/',
  {
    query: {
      limit: 1000, //max limit: 1000
      offset: state.meta && state.meta.next ? state.meta.limit + state.meta.offset : 0,
      extras: true
    },
  },
  state => {
    const { meta, objects } = state.data;
    const { openfnInboxUrl } = state.configuration;
    // const filterCriteria = [
    //   'xyz', //Q: Do we want to filter to only pull some users? 
    // ];

    const users = objects;  //.filter(obj => filterCriteria.includes(obj.form['@xmlns']));
    state.configuration = { baseUrl: 'https://www.openfn.org' };
    console.log('Posting data to OpenFn Inbox...', objects);
//== Then we post the user data back to the OpenFn Inbox ==========================//
    return each(users, state => {
      return post(`/inbox/${openfnInboxUrl}`, { body: state.data, type: 'user' }, state => ({
        ...state,
        data: {},
        references: [],
      }))(state);
    })(state);
  }
);