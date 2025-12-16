import axios from 'axios';

// URL da sua API (pode ser sobrescrita por REACT_APP_API_URL)
const API_URL = process.env.REACT_APP_API_URL || 'http://desafio-backend-env.eba-ye6nwcjq.us-east-1.elasticbeanstalk.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptadores para logar e tratar erros de forma consistente
api.interceptors.request.use((config) => {
  // possível ponto para adicionar auth headers no futuro
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use((resp) => resp, (error) => {
  if (error.response) {
    console.error('API response error:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('No response received from API:', error.request);
  } else {
    console.error('API error:', error.message);
  }
  return Promise.reject(error);
});

// Funções para Usuários
export const userAPI = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  uploadAvatar: (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAvatar: (userId) => api.delete(`/users/${userId}/avatar`)
};

// Funções para Cidades
export const cityAPI = {
  getCities: () => api.get('/cities'),
  createCity: (cityData) => api.post('/cities', cityData)
};

// Funções para Categorias
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (categoryData) => api.post('/categories', categoryData)
};

// Funções para Serviços
export const serviceAPI = {
  getServices: (cityId, categoryId) => {
    const params = {};
    if (cityId) params.city_id = cityId;
    if (categoryId) params.category_id = categoryId;
    return api.get('/services', { params });
  },
  createService: (serviceData) => api.post('/services', serviceData),
  uploadLogo: (serviceId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/services/${serviceId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteService: (serviceId) => api.delete(`/services/${serviceId}`)
};

// Função para verificar saúde da API
export const healthCheck = () => api.get('/health');

export default api;