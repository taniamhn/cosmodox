const _routes = {
  '': 'home',
  'home': 'home',
  'register/user': 'user-register',
  'register/group': 'group-register',
  'register/institution': 'institution-register',
};

const _privateRoutes = {
  'profile': 'profile',
  'project': 'project',
  'institution': 'institution',
  'research-group': 'research-group',
};

const routeToPage = (location, isAuthenticated) => {
  const path = window.decodeURIComponent(location.pathname);
  const splitPath = (path || '').slice(1).split('/');
  const page = splitPath[0];
  return isAuthenticated ? _privateRoutes[page] : _routes[page];
};

export { routeToPage };