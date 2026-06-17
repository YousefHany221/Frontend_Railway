import client from './client';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await client.get('/admin/dashboard/stats');
    return response.data;
  },

  getChildrenOverview: async () => {
    const response = await client.get('/admin/dashboard/children');
    return response.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await client.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (data) => {
    const response = await client.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (userId, data) => {
    const response = await client.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await client.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Children
  getChildren: async (params = {}) => {
    const response = await client.get('/admin/children', { params });
    return response.data;
  },

  deleteChild: async (childId) => {
    const response = await client.delete(`/admin/children/${childId}`);
    return response.data;
  },

  // Verification Logs
  getVerificationLogs: async (params = {}) => {
    const response = await client.get('/admin/verification-logs', { params });
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await client.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await client.put('/admin/settings', data);
    return response.data;
  },

  // Notifications
  getNotifications: async (params = {}) => {
    const response = await client.get('/admin/notifications', { params });
    return response.data;
  },

  getUnreadNotificationsCount: async () => {
    const response = await client.get('/admin/notifications/unread-count');
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await client.patch(`/admin/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await client.patch('/admin/notifications/read-all');
    return response.data;
  },
};
