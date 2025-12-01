import api from "@/lib/axios";

export const authService = {
  signUp: async (username: string, password: string, email: string, phone: string, firstName: string, lastName: string) => {
    const response = await api.post('/auth/signup', { username, password, email, phone, firstName, lastName }, { withCredentials: true });
    return response.data;
  },
  signIn: async (username: string, password: string) => {
    const response = await api.post('/auth/signin', { username, password }, { withCredentials: true });
    return response.data;
  },
  signOut: async () => {
    const response = await api.post('/auth/signout', {withCredentials: true});
    return response.data;
  },
  fetchMe: async () => {
    const response = await api.get('/user/me', {withCredentials: true});
    return response.data.user;
  },
  refreshToken: async () => {
    const response = await api.post('/auth/refresh', {withCredentials: true});
    return response.data.accessToken;
  }
}