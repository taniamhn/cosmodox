const fragmentTypes = {
  __schema: {
    types: [
      {
        kind: 'INTERFACE',
        name: 'Profile',
        possibleTypes: [
          { name: 'PersonalAccount' },
          { name: 'ResearchGroup' },
          { name: 'Institution' },
        ],
      },
    ],
  },
};

const fragmentMatcher = new Apollo.IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes,
});

if (!window.Apollo.client) {
  const client = new Apollo.ApolloClient({
    link: Apollo.ApolloLink.from([
      Apollo.onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) => {
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          });
        }
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new Apollo.HttpLink({
        uri: '/graphql',
        credentials: 'same-origin',
      }),
    ]),
    cache: new Apollo.InMemoryCache({ fragmentMatcher }),
  });

  window.__APOLLO_CLIENT__ = client;
  window.Apollo.client = client;
}
