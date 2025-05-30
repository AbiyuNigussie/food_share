import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

interface DeliveryFilter {
  page?: number;
  rowsPerPage?: number;
  status?: string;
}

export const deliveryService = {
  getLogisticDeliveries: async (
    token: string,
    filters: DeliveryFilter = {}
  ) => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.rowsPerPage)
      params.append("rowsPerPage", filters.rowsPerPage.toString());
    if (filters.status) params.append("status", filters.status);

    return axios.get(`${BASE_URL}/deliveries?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getDeliveryById: async (token: string, id: string) => {
    return axios.get(`${BASE_URL}/deliveries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Example placeholder for updating delivery status
  updateDeliveryStatus: async (token: string, id: string, status: string) => {
    return axios.patch(
      `${BASE_URL}/deliveries/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
