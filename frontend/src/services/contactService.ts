import axios from "axios";

// Base URL for contact endpoints
const API_URL = "/api/contact";

// Submit a new contact message (public)
export const submitContactMessage = async (data: {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Admin: respond to a contact message (requires admin token)
export const respondToContactMessage = async (
  contactMessageId: string,
  response: string,
  token: string
) => {
  const res = await axios.post(
    `${API_URL}/response`,
    { contactMessageId, response },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Admin: update an admin response (requires admin token)
export const updateAdminResponse = async (
  responseId: string,
  message: string,
  token: string
) => {
  const res = await axios.put(
    `${API_URL}/responses/${responseId}`,
    { message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Admin: get all messages with responses (requires admin token)
export const getMessagesWithResponses = async (token: string) => {
  const res = await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Admin: delete a contact message (requires admin token)
export const deleteContactMessage = async (
  messageId: string,
  token: string
) => {
  const res = await axios.delete(`${API_URL}/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
