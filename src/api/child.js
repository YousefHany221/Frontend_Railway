import client from './client';

export const childService = {
  registerChild: async (data) => {
    const response = await client.post('/children/register', data);
    return response.data;
  },

  registerChildByParent: async (data) => {
    const response = await client.post('/children/register-by-parent', data);
    return response.data;
  },

  textSearch: async (data) => {
    const response = await client.post('/children/text-search', data);
    return response.data;
  },

  searchByFootprint: async (data) => {
    const response = await client.post('/children/search-by-footprint', data);
    return response.data;
  },

  validateFootprint: async (data) => {
    const response = await client.post('/children/validate-footprint', data);
    return response.data;
  },
};
