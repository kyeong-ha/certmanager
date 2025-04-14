import axios from 'axios';

// CSRF 토큰을 쿠키에서 추출하는 함수
const getCSRFToken = () => {
  const match = document.cookie.match(/csrftoken=([\w-]+)/);
  return match ? match[1] : '';
};

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export default api;