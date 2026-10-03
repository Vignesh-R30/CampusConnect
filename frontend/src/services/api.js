const rawApiUrl = import.meta.env.VITE_API_URL || 'https://campusconnect-backend-53b2.onrender.com/api';
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export default API_URL;
