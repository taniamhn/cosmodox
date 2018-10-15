if (!window.Apollo.client) {
    const client = new Apollo.ApolloClient({
        uri: '/graphql',
    });

    window.__APOLLO_CLIENT__ = client;
    window.Apollo.client = client;
}
