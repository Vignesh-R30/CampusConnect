const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export default API_URL;
