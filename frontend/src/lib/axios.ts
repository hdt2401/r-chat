import { useAuthStore } from '@/stores/auth';
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
})

// assign the token to the headers request
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// auto call refresh token if 401 error occurs
api.interceptors.response.use((res) => res, async (error) => {
  const originalRequest = error.config;

  // api list dont need check
  if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/signin') || originalRequest.url.includes('/auth/signup')) {
    return Promise.reject(error);
  }

  originalRequest._retry = originalRequest._retry || 0;

  if (error.response?.status === 403 && originalRequest._retry < 4) {
    originalRequest._retry += 1;

    try {
      const res = await api.post('/auth/refresh', {}, { withCredentials: true });
      const newAccessToken = res.data.accessToken;
      useAuthStore.getState().setAccessToken(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      console.error('Refresh token failed', err);
      useAuthStore.getState().clearState();
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
});

export default api