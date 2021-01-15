get(
  'https://www.commcarehq.org/a/miraclefeet/api/v0.5/form/',
  {
    query: {
      limit: 10, // To update for fetching a specific number of forms
      offset:
        state.meta && state.meta.next
          ? state.meta.limit + state.meta.offset
          : 0,

      xmlns:
        'http://openrosa.org/formdesigner/34532e2a938003aae150198e2613ed2b54c410fb', // Register New Patient
      received_on_start: '2018-01-01', // update to needed period: 'XXXX-XX-01'
      received_on_end: '2018-12-31', // update to needed period: 'XXXX-XX-31'
    },
  },
  state => {
    const { meta, objects } = state.data;
    const { openfnInboxUrl } = state.configuration;
    state.meta = meta;
    console.log('Metadata in CommCare response for Register New Patient:');
    console.log(meta);
    const body = objects.filter(form => {
      const { received_on, server_modified_on } = form;
      const receivedOnDate = new Date(received_on);
      const serverModifiedOnDate = new Date(server_modified_on);
      receivedOnDate.setHours(0, 0, 0, 0);
      serverModifiedOnDate.setHours(0, 0, 0, 0);
      return (
        receivedOnDate.toISOString() === serverModifiedOnDate.toISOString()
      );
    });
    console.log(body.length, 'forms fetched...');

    return each(
      body,
      alterState(state => {
        const { received_on, server_modified_on } = state.data;
        const receivedOnDate = new Date(received_on);
        const serverModifiedOnDate = new Date(server_modified_on);
        receivedOnDate.setHours(0, 0, 0, 0);
        serverModifiedOnDate.setHours(0, 0, 0, 0);

        return post(
          `${openfnInboxUrl}`,
          { body: state => state.data },
          state => ({ ...state, data: {}, references: [] })
        )(state);
      })
    )(state);
  }
);

get(
  'https://www.commcarehq.org/a/miraclefeet/api/v0.5/form/',
  {
    query: {
      limit: 10, // To update for fetching a specific number of forms
      offset:
        state.meta && state.meta.next
          ? state.meta.limit + state.meta.offset
          : 0,

      xmlns:
        'http://openrosa.org/formdesigner/8FAE7619-BCEA-4C28-B2F4-6989BA4AF3CF', // Log Visit Details
      received_on_start: '2018-01-01', // update to needed period: 'XXXX-XX-01'
      received_on_end: '2018-12-31', // update to needed period: 'XXXX-XX-31'
    },
  },
  state => {
    const { meta, objects } = state.data;
    const { openfnInboxUrl } = state.configuration;
    state.meta = meta;
    console.log('Metadata in CommCare response for Log Visit Details:');
    console.log(meta);
    const body = objects.filter(form => {
      const { received_on, server_modified_on } = form;
      const receivedOnDate = new Date(received_on);
      const serverModifiedOnDate = new Date(server_modified_on);
      receivedOnDate.setHours(0, 0, 0, 0);
      serverModifiedOnDate.setHours(0, 0, 0, 0);
      return (
        receivedOnDate.toISOString() === serverModifiedOnDate.toISOString()
      );
    });
    console.log(body.length, 'forms fetched...');

    return each(
      body,
      alterState(state => {
        const { received_on, server_modified_on } = state.data;
        const receivedOnDate = new Date(received_on);
        const serverModifiedOnDate = new Date(server_modified_on);
        receivedOnDate.setHours(0, 0, 0, 0);
        serverModifiedOnDate.setHours(0, 0, 0, 0);

        return post(
          `${openfnInboxUrl}`,
          { body: state => state.data },
          state => ({ ...state, data: {}, references: [] })
        )(state);
      })
    )(state);
  }
);
