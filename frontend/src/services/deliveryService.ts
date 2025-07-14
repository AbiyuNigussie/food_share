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

  getMyDeliveries: (
    token: string,
    filters: DeliveryFilter = {}
  ) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.rowsPerPage) params.append("rowsPerPage", filters.rowsPerPage.toString());
    if (filters.status) params.append("status", filters.status);

    return axios.get(`${BASE_URL}/my/deliveries?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getDeliveryById: async (token: string, id: string) => {
    return axios.get(`${BASE_URL}/deliveries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Assign a logistics staff to a delivery
  assignDelivery: async (token: string, deliveryId: string) =>
    axios.post(
      `${BASE_URL}/deliveries/assign`,
      { deliveryId },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  // Schedule pickup for a delivery
  schedulePickup: (token: string, deliveryId: string, datetime: string) =>
    axios.post(
      `${BASE_URL}/deliveries/${deliveryId}/schedule-pickup`,
      { datetime },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  // Mark pickup as completed
  completePickup: (token: string, deliveryId: string) =>
    axios.post(
      `${BASE_URL}/deliveries/${deliveryId}/complete-pickup`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  // Schedule dropoff for a delivery
  scheduleDropoff: (token: string, deliveryId: string, datetime: string) =>
    axios.post(
      `${BASE_URL}/deliveries/${deliveryId}/schedule-dropoff`,
      { datetime },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  // Mark dropoff as completed
  completeDropoff: (token: string, deliveryId: string) =>
    axios.post(
      `${BASE_URL}/deliveries/${deliveryId}/complete-dropoff`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  // Mark delivery as fully completed
  completeDelivery: (token: string, deliveryId: string) =>
    axios.post(
      `${BASE_URL}/deliveries/${deliveryId}/complete-delivery`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  updateStatus: (token: string, deliveryId: string, status: string) =>
    axios.patch(
      `${BASE_URL}/deliveries/${deliveryId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    ),
};
