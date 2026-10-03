const API_URL = import.meta.env.VITE_API_URL || 'https://campusconnect-backend-53b2.onrender.com/api';

export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export default API_URL;
