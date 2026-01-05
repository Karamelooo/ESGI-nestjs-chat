import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return {
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      token: token || null,
    };
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { username, password });
        this.setAuth(res.data);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    async register(username: string, password: string, color: string) {
      try {
        const res = await axios.post(`${API_URL}/auth/register`, { username, password, color });
        this.setAuth(res.data);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    async updateProfile(username: string, color: string) {
      try {
        const res = await axios.patch(`${API_URL}/users/${this.user.id}`, { username, color });
        this.user = { ...this.user, ...res.data };
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    setAuth(data: any) {
      this.token = data.access_token;
      this.user = data.user;
      if (this.token) localStorage.setItem('token', this.token);
      if (this.user) localStorage.setItem('user', JSON.stringify(this.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
});
