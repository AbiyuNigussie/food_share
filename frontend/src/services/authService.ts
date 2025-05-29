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

  getDonations: (token: string, page = 1, rowsPerPage = 5) => {
    return axios.get(
      `${BASE_URL}/donations?page=${page}&rowsPerPage=${rowsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

  deleteDonation: async (donationId: string, token: string) => {
    return axios.delete(`${BASE_URL}/donations/${donationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getNeeds: (token: string, page = 1, limit = 5) => {
    return axios.get(`${BASE_URL}/needs?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createNeed: (
    data: {
      foodType: string;
      quantity: string;
      DropOffAddress: string;
      notes?: string;
    },
    token: string
  ) =>
    axios.post(`${BASE_URL}/needs`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteNeed: (id: string, token: string) =>
    axios.delete(`${BASE_URL}/needs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateNeed: (
    needId: string,
    data: {
      foodType?: string;
      quantity?: string;
      DropOffAddress?: string;
      notes?: string;
    },
    token: string
  ) =>
    axios.put(`${BASE_URL}/needs/${needId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  claimMatch: (token: string, needId: string, donationId: string) => {
  return axios.post(
    `${BASE_URL}/matches`,
    { needId, donationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
},
  
// Fetches Notification[] directly
getNotifications: async (token: string) => {
  const res = await axios.get(
    `${BASE_URL}/notifications`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // res.data === { data: Notification[] }
  return res.data.data as Notification[];
},

// Marks a notification read, returns the updated record
markNotificationRead: async (id: string, token: string) => {
  const res = await axios.put(
    `${BASE_URL}/notifications/${id}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // res.data === { data: Notification }
  return res.data.data as Notification;
},

};
