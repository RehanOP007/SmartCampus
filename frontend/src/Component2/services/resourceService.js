import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const resourceService = {
  // get all resources
  getAllResources: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // create resource
  createResource: async (resourceData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/resources`, resourceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // resource update
  updateResource: async (id, resourceData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/resources/${id}`, resourceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // delete resource
  deleteResource: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Search and Filter
  searchResources: async (params) => {
    try {
      const token = localStorage.getItem('token');
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/resources/search?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default resourceService;