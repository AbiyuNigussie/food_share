// src/api/admin.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

export const fetchDashboardStats = () => API.get("/dashboard");
export const fetchUsers = () => API.get("/users");
export const verifyUser = (userId: string) =>
  API.patch(`/users/${userId}/verify`);
export const fetchReport = () => API.get("/report/donations");
