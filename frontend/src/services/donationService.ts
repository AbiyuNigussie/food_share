import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

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
};
