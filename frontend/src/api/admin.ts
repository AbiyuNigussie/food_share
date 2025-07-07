// src/api/admin.ts

import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const getAuthHeaders = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = useAuth();
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
  } catch {}
  // fallback to localStorage for non-component usage
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.token) return { Authorization: `Bearer ${user.token}` };
    } catch {}
  }
  return {};
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/admin",
});

export const fetchDashboardStats = () =>
  API.get("/dashboard", { headers: getAuthHeaders() });
export const fetchUsers = () =>
  API.get("/users", { headers: getAuthHeaders() });
export const verifyUser = (userId: string) =>
  API.patch(`/users/${userId}/verify`, {}, { headers: getAuthHeaders() });
export const fetchPendingRecipients = () =>
  API.get("/recipients/pending", { headers: getAuthHeaders() });
export const approveRecipient = (userId: string) =>
  API.patch(`/recipients/${userId}/approve`, {}, { headers: getAuthHeaders() });
export const rejectRecipient = (userId: string) =>
  API.delete(`/recipients/${userId}/reject`, { headers: getAuthHeaders() });
