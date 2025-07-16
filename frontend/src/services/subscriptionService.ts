import axios from "axios";

const BASE_URL = import.meta.env.BASE_URL || "http://localhost:5000/api";

interface Subscription {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  plan: string;
}
export const subscriptionService = {
  initializePayment: async (subscription: Subscription) => {
    return axios.post(`${BASE_URL}/payment/initialize`, {
      amount: subscription.amount,
      currency: subscription.currency,
      email: subscription.email,
      first_name: subscription.first_name,
      last_name: subscription.last_name,
      plan: subscription.plan,
    });
  },
  verifyPayment: async (sessionId: string) => {
    return await axios.get(`${BASE_URL}/payment/payment-success`, {
      params: { session_id: sessionId },
    });
  },
};
