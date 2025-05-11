import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // change accordingly

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
    return axios.post(`${BASE_URL}/user/auth/register`, {
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
    return axios.post(`${BASE_URL}/user/auth/login`, {
      email,
      password,
      role,
    });
  },

  verifyEmail: async (token: string) => {
    return axios.post(`${BASE_URL}/user/auth/verify-email`, { token });
  },

  forgotPassword: async (email: string) => {
    return axios.post(`${BASE_URL}/user/auth/forgot-password`, { email });
  },

  updatePassword: async (token: string, password: string) => {
    return axios.post(`${BASE_URL}/user/auth/reset-password/${token}`, {
      password,
    });
  },

  adminRegister: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    secretKey: string;
  }) => {
    return axios.post(`${BASE_URL}/admin/auth/register`, payload);
  },

  adminLogin: (email: string, password: string) => {
    return axios.post(`${BASE_URL}/admin/auth/login`, {
      email,
      password,
    });
  },

  createDonation: async (donationData: any, token: string) => {
    return axios.post(`${BASE_URL}/donations`, donationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getDonations: async (token: string) => {
    return axios.get(`${BASE_URL}/donations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateDonationStatus: async (
    donationId: number,
    status: string,
    token: string
  ) => {
    return axios.put(
      `${BASE_URL}/donations/${donationId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  deleteDonation: async (donationId: number, token: string) => {
    return axios.delete(`${BASE_URL}/donations/${donationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
