import client, { ensureCsrf } from './client'; // ✅ تم إضافة ensureCsrf هنا

export const authService = {
  login: async (credentials) => {
    // 🔒 اطلب الـ CSRF Cookie أولاً لتأمين المتصفح أونلاين ومنع الـ CORS
    await ensureCsrf();
    const response = await client.post('/login', credentials);
    return response.data;
  },

  register: async (data) => {
    // 🔒 اطلب الـ CSRF Cookie أولاً لتأمين عمليات التسجيل الجديدة أونلاين
    await ensureCsrf();
    const response = await client.post('/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await client.post('/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await client.get('/user');
    return response.data;
  },

  // Account settings (all roles)
  getSettings: async () => {
    const response = await client.get('/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await client.put('/settings', data);
    return response.data;
  },

  updateProfile: async (data) => {
    console.log('Sending to backend:', data);
    const response = await client.post('/user/profile', data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await client.put('/user/password', data);
    return response.data;
  },

  sendEmailVerification: async () => {
    const response = await client.post('/email/verification-notification');
    return response.data;
  },

  verifyEmail: async (id, hash) => {
    const response = await client.get(`/verify-email/${id}/${hash}`);
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await client.post('/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await client.post('/reset-password', data);
    return response.data;
  },
};
