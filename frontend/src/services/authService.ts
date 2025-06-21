import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const authService = {
  // === User Authentication ===
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    role: string,
    organization?: string,
    amount?: number
  ) => {
    return axios.post(`${BASE_URL}/user/auth/register`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      organization,
      amount,
    });
  },

  login: async (email: string, password: string, role: string) => {
    return axios.post(`${BASE_URL}/user/auth/login`, { email, password, role });
  },

  verifyEmail: async (token: string) =>
    axios.post(`${BASE_URL}/user/auth/verify-email`, { token }),

  forgotPassword: async (email: string) =>
    axios.post(`${BASE_URL}/user/auth/forgot-password`, { email }),

  updatePassword: async (token: string, password: string) =>
    axios.post(`${BASE_URL}/user/auth/reset-password/${token}`, { password }),

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

  adminLogin: (email: string, password: string) =>
    axios.post(`${BASE_URL}/admin/auth/login`, { email, password }),

  // === Donation (Donor) ===
  createDonation: async (donationData: any, token: string) => {
    return axios.post(`${BASE_URL}/donations`, donationData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getDonations: (token: string, page = 1, rowsPerPage = 5) => {
    return axios.get(
      `${BASE_URL}/donations?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  updateDonationStatus: async (
    donationId: string,
    status: string,
    token: string
  ) => {
    return axios.put(
      `${BASE_URL}/donations/${donationId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  deleteDonation: async (donationId: string, token: string) => {
    return axios.delete(`${BASE_URL}/donations/${donationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // === Recipient Needs (Recipient) ===
  getNeeds: (token: string, page = 1, limit = 5) => {
    return axios.get(`${BASE_URL}/needs?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  createNeed: (
    payload: {
      foodType: string;
      quantity: string;
      dropoffLocation: { label: string; latitude: number; longitude: number };
      contactPhone: string;
      notes?: string;
    },
    token: string
  ) => {
    return axios.post(
      `${BASE_URL}/needs`,
      {
        foodType: payload.foodType,
        quantity: payload.quantity,
        dropoffLocation: {
          label: payload.dropoffLocation.label,
          latitude: payload.dropoffLocation.latitude,
          longitude: payload.dropoffLocation.longitude,
        },
        contactPhone: payload.contactPhone,
        notes: payload.notes,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  deleteNeed: (id: string, token: string) => {
    return axios.delete(`${BASE_URL}/needs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateNeed: (
    needId: string,
    data: {
      foodType?: string;
      quantity?: string;
      dropoffLocation?: { label: string; latitude: number; longitude: number };
      contactPhone?: string;
      notes?: string;
    },
    token: string
  ) => {
    return axios.put(`${BASE_URL}/needs/${needId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // === Matching (Recipient) ===
  claimMatch: (token: string, needId: string, donationId: string) => {
    return axios.post(
      `${BASE_URL}/matches`,
      { needId, donationId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // === Claiming a Donation (Recipient) ===
  claimDonation: async (
    donationId: string,
    payload: {
      dropoffLocation: {
        label: string;
        latitude: number;
        longitude: number;
      };
      recipientPhone: string;
      deliveryNotes?: string;
    },
    token: string
  ) => {
    const res = await axios.post(
      `${BASE_URL}/donations/${donationId}/claim`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },

  // === Notifications ===
  getNotifications: async (token: string) => {
    const res = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as Notification[];
  },

  markNotificationRead: async (id: string, token: string) => {
    const res = await axios.put(
      `${BASE_URL}/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data as Notification;
  },

  // === Recipient’s View of Their Donations ===
  getMatchedDonations: (token: string, page = 1, rowsPerPage = 5) => {
    return axios.get(
      `${BASE_URL}/recipient/donations/matched?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  getClaimedDonations: (token: string, page = 1, rowsPerPage = 5) => {
    return axios.get(
      `${BASE_URL}/recipient/donations/claimed?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // …inside authService object:
  getDonorMatchedDonations: (token: string, page = 1, rowsPerPage = 5) =>
    axios.get(
      `${BASE_URL}/donor/donations/matched?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  getDonorClaimedDonations: (token: string, page = 1, rowsPerPage = 5) =>
    axios.get(
      `${BASE_URL}/donor/donations/claimed?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),

    getDonorInsights: (token: string) =>
    axios.get(`${BASE_URL}/donor/insights`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getRecipientInsights: (token: string) =>
    axios.get(`${BASE_URL}/recipient/insights`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
