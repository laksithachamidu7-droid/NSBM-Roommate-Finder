import api from './api';

export const propertyService = {
  getAllProperties: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.maxRent) params.append('maxRent', filters.maxRent);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms);

    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },
  deleteProperty: async (id) => {
    await api.delete(`/properties/${id}`);
  },
  getSavedProperties: async () => {
    const response = await api.get('/properties/saved');
    return response.data;
  },
  saveProperty: async (id) => {
    await api.post(`/properties/${id}/save`);
  },
  unsaveProperty: async (id) => {
    await api.delete(`/properties/${id}/save`);
  }
};
