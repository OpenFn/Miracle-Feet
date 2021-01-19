alterState(state => {
  // Month prior ====================================================
  const date = new Date();
  const month = date.getMonth();
  let month_prior_start = new Date(date.getFullYear(), month - 1, 1);
  month_prior_start = month_prior_start.toISOString().split('T')[0];
  let month_prior_end = new Date(date.getFullYear(), month, 0);
  month_prior_end = month_prior_end.toISOString().split('T')[0];
  // ================================================================

  // Manual cursors =================================================
  const received_on_start = '2021-01-01'; // start date
  const received_on_end = '2021-01-31'; // start date
  // ================================================================

  // const cursorStart = month_prior_start || received_on_start; // Remove 'month_prior_start ||' to use manualCursor
  const cursorStart = received_on_start
  // const cursorEnd = month_prior_end || received_on_end; // Remove 'month_prior_end ||' to use manualCursor
  const cursorEnd = received_on_end

  return {
    ...state,
    cursorStart,
    cursorEnd,
  };
});

alterState(state => {
  return get(
    'https://www.commcarehq.org/a/miraclefeet/api/v0.5/form/',
    {
      query: {
        limit: 1000, // To update for fetching a specific number of forms
        offset:
          state.meta && state.meta.next
            ? state.meta.limit + state.meta.offset
            : 0,

        xmlns:
          'http://openrosa.org/formdesigner/34532e2a938003aae150198e2613ed2b54c410fb', // Register New Patient
        received_on_start: state.cursorStart,
        received_on_end: state.cursorEnd,
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
      console.log(`Posting to OpenFn Inbox...${JSON.stringify(body, null, 2)}`);

      return each(
        body,
        alterState(state => {
          return post(
            `${openfnInboxUrl}`,
            { body: state => state.data },
            state => ({ ...state, data: {}, references: [] })
          )(state);
        })
      )(state);
    }
  )(state);
});

alterState(state => {
  return get(
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
        received_on_start: state.cursorStart,
        received_on_end: state.cursorEnd,
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
      console.log(`Posting to OpenFn Inbox...${JSON.stringify(body, null, 2)}`);

      return each(
        body,
        alterState(state => {
          return post(
            `${openfnInboxUrl}`,
            { body: state => state.data },
            state => ({ ...state, data: {}, references: [] })
          )(state);
        })
      )(state);
    }
  )(state);
});