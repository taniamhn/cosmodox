const _routes = {
  '^\\/$': 'home',
  '^\\/home$': 'home',
  '^\\/register\\/user$': 'user-register',
  '^\\/register\\/group$': 'group-register',
  '^\\/register\\/institution$': 'institution-register',
};

const _privateRoutes = {
  '^\\/profile$': 'profile',
  '^\\/project$': 'project',
  '^\\/institution\\/(?<id>\\d+)$': 'institution',
  '^\\/research-group$': 'research-group',
};

const _getPageFromPath = (path, routes) => {
  const key = Object.keys(routes).filter(e => (new RegExp(e, 'm')).test(path));
  const params = path.match(new RegExp(key, 'm')).groups;
  return { params, page: routes[key] };
};

const routeToPage = (location, isAuthenticated) => {
  const path = window.decodeURIComponent(location.pathname);
  return isAuthenticated ? _getPageFromPath(path, _privateRoutes) : _getPageFromPath(path, _routes);
};

export { routeToPage };