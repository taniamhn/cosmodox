const storageKey = 'userAuthenticated';

const login = (element) => {
  localStorage.setItem(storageKey, true);
  element.dispatchEvent(new CustomEvent('authentication-change', {
    bubbles: true,
    composed: true,
    detail: { status: true },
  }));
};

const logoutClient = (element) => {
  localStorage.removeItem(storageKey);
  element.dispatchEvent(new CustomEvent('authentication-change', {
    bubbles: true,
    composed: true,
    detail: { status: false },
  }));
  window.location = '/';
};

const logoutMutation = Apollo.gql`
  mutation logout {
    logout { ok }
  }
`;

const logout = (element) => {
  Apollo.client.mutate({
    mutation: logoutMutation,
  })
    .then((result) => {
      const { ok } = result.data.logout;
      if (ok) {
        logoutClient(element);
      }
    });
};

const checkAuth = () => !!localStorage.getItem(storageKey);

export { login, logout, checkAuth };
