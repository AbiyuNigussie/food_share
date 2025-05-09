import axios from "axios";

const BASE_URL = "http://localhost:5000/api/user/auth"; // change accordingly

export const authService = {
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    role: string,
    organization?: string
  ) => {
    return axios.post(`${BASE_URL}/register`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      organization,
    });
  },

  login: async (email: string, password: string, role: string) => {
    return axios.post(`${BASE_URL}/login`, {
      email,
      password,
      role,
    });
  },

  verifyEmail: async (token: string) => {
    return axios.post(`${BASE_URL}/verify-email`, { token });
  },

  forgotPassword: async (email: string) => {
    return axios.post(`${BASE_URL}/forgot-password`, { email });
  },

  updatePassword: async (token: string, password: string) => {
    return axios.post(`${BASE_URL}/reset-password/${token}`, { password });
  },
};
