const _routes = {
    '/': 'home',
    '/home': 'home',
    '/register/user': 'user-register',
    '/register/group': 'group-register',
    '/register/institution': 'institution-register',
}

const _privateRoutes = {
    '/profile': 'profile',
    '/project': 'project',
    '/institution': 'institution',
    '/research-group': 'research-group',
}

const routeToPage = (path, isAuthenticated) => {
    return isAuthenticated ? _privateRoutes[path]: _routes[path];
};

export { routeToPage };