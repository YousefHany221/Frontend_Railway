import client from './client';

export const parentService = {
  getMyChildren: async () => {
    const response = await client.get('/my-children');
    return response.data;
  },

  getChild: async (childId) => {
    const response = await client.get(`/my-children/${childId}`);
    return response.data;
  },

  reportMissing: async (data) => {
    const response = await client.post('/missing-reports', data);
    return response.data;
  },
};
