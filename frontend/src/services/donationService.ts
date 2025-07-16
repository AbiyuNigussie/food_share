import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface DonationFilters {
  page?: number;
  rowsPerPage?: number;
  donorName?: string;
  foodType?: string;
  status?: string;
}

export const donationService = {
  getFilteredDonations: async (
    token: string,
    filters: DonationFilters = {}
  ) => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.rowsPerPage)
      params.append("rowsPerPage", filters.rowsPerPage.toString());
    if (filters.foodType) params.append("foodType", filters.foodType);
    if (filters.status) params.append("status", filters.status);

    return axios.get(`${BASE_URL}/donations/filtered?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  claimDonation: async (
    donationId: string,
    token: string,
    data: {
      dropoffLocation: {
        label: string;
        latitude: number;
        longitude: number;
      };
      recipientPhone: string;
      deliveryNotes?: string;
    }
  ) => {
    return axios.post(`${BASE_URL}/donations/${donationId}/claim`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getMyDonations: (token: string, page: number, rowsPerPage: number) =>
    axios.get(`${BASE_URL}/donations/my`, {
      params: { page, rowsPerPage },
      headers: { Authorization: `Bearer ${token}` },
    }),
};
