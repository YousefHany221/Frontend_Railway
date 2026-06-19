import client from './client';

export const parentService = {
  // 🚀 التعديل الصحيح: بدون تكرار كلمة /api لأن الـ client يضيفها تلقائياً
  getMyChildren: async () => {
    const response = await client.get('/children'); // سيتحول تلقائياً إلى /api/children
    return response.data;
  },

  getChild: async (childId) => {
    const response = await client.get(`/children/${childId}`);
    return response.data;
  },

  reportMissing: async (data) => {
    const response = await client.post('/missing-reports', data);
    return response.data;
  },
};
