import axiosInstance from "./axiosInstance";

const BASE_URL = "http://localhost:5000/api";

export const authService = {
  // === User Authentication ===
  register: async (data: any, isFormData: boolean = false) => {
    if (isFormData) {
      return axiosInstance.post(`/user/auth/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      // old style for non-recipient
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
        organization,
        amount,
      } = data;
      return axiosInstance.post(`/user/auth/register`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
        organization,
        amount,
      });
    }
  },

  login: async (email: string, password: string, role: string) => {
    return axiosInstance.post(`/user/auth/login`, { email, password, role });
  },

  verifyEmail: async (token: string) =>
    axiosInstance.post(`/user/auth/verify-email`, { token }),

  forgotPassword: async (email: string) =>
    axiosInstance.post(`/user/auth/forgot-password`, { email }),

  updatePassword: async (token: string, password: string) =>
    axiosInstance.post(`/user/auth/reset-password/${token}`, { password }),

  adminRegister: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    secretKey: string;
  }) => {
    return axiosInstance.post(`/admin/auth/register`, payload);
  },

  adminLogin: (email: string, password: string) =>
    axiosInstance.post(`/admin/auth/login`, { email, password }),

  // === Donation (Donor) ===
  createDonation: async (donationData: any, token: string) => {
    return axiosInstance.post(`/donations`, donationData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getDonorDonations: (token: string, page: number, rowsPerPage: number) =>
    axiosInstance.get(`/donations/my?page=${page}&rowsPerPage=${rowsPerPage}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateDonationStatus: async (
    donationId: string,
    status: string,
    token: string
  ) => {
    return axiosInstance.put(
      `${BASE_URL}/donations/${donationId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  deleteDonation: async (donationId: string, token: string) => {
    return axiosInstance.delete(`/donations/${donationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // === Recipient Needs (Recipient) ===
  getNeeds: (token: string, page = 1, limit = 5) => {
    return axiosInstance.get(`/needs?page=${page}&limit=${limit}`, {
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
    return axiosInstance.post(
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
    return axiosInstance.delete(`/needs/${id}`, {
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
    return axiosInstance.put(`/needs/${needId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // === Matching (Recipient) ===
  claimMatch: (token: string, needId: string, donationId: string) => {
    return axiosInstance.post(
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
    const res = await axiosInstance.post(
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
    const res = await axiosInstance.get(`/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as Notification[];
  },

  markNotificationRead: async (id: string, token: string) => {
    const res = await axiosInstance.put(
      `/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data as Notification;
  },

  // === Recipient’s View of Their Donations ===
  getMatchedDonations: (token: string, page = 1, rowsPerPage = 5) => {
    return axiosInstance.get(
      `/recipient/donations/matched?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  getClaimedDonations: (token: string, page = 1, rowsPerPage = 5) => {
    return axiosInstance.get(
      `/recipient/donations/claimed?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // …inside authService object:
  getDonorMatchedDonations: (token: string, page = 1, rowsPerPage = 5) =>
    axiosInstance.get(
      `/donor/donations/matched?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  getDonorClaimedDonations: (token: string, page = 1, rowsPerPage = 5) =>
    axiosInstance.get(
      `/donor/donations/claimed?page=${page}&rowsPerPage=${rowsPerPage}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  updateProfile: (
    token: string,
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    }
  ) => {
    return axiosInstance.put(`/user/profile`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  changePassword: (
    token: string,
    currentPassword: string,
    newPassword: string
  ) =>
    axiosInstance.post(
      `/user/change-password`,
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  getDonorInsights: (token: string) =>
    axiosInstance.get(`/donor/insights`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getRecipientInsights: (token: string) =>
    axiosInstance.get(`/recipient/insights`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getMyDeliveries: (token: string, page = 1, rowsPerPage = 8) =>
    axiosInstance.get(`/my/deliveries`, {
      params: { page, rowsPerPage },
      headers: { Authorization: `Bearer ${token}` },
    }),
};
