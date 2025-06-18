// src/api/admin.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // change if your backend runs on another port
});

export const fetchDashboardStats = () => API.get('/dashboard');
export const fetchUsers = () => API.get('/users');
export const verifyUser = (userId: string) => API.patch(`/users/${userId}/verify`);
