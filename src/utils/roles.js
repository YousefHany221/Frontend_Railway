export const getDashboardPath = (role) => {
  const rolePaths = {
    admin: '/admin/dashboard',
    nurse: '/nurse/dashboard',
    police: '/police/dashboard',
    user: '/parent/dashboard',
  };
  return rolePaths[role] || '/login';
};

export const roleAllowsRoute = (userRole, routePath) => {
  const roleRoutes = {
    admin: ['/admin/dashboard', '/nurse/dashboard', '/police/dashboard', '/parent/dashboard'],
    nurse: ['/nurse/dashboard'],
    police: ['/police/dashboard'],
    user: ['/parent/dashboard'],
  };
  
  const allowedRoutes = roleRoutes[userRole] || [];
  return allowedRoutes.some(route => routePath.startsWith(route));
};
