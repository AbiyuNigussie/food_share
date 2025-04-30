const BASE_URL = 'http://localhost:5000/api/user/auth'; // change accordingly

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
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
        organization
      }),
    });
    return response;
  },
  

  login: async (email: string, password: string, role:string) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return response;
  },

  verifyEmail: async (token: string) => {
    const response = await fetch(`${BASE_URL}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return response;
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response;
  },
  updatePassword: async (token: string, password: string) => {
    const response = await fetch(`${BASE_URL}/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return response;
  },
};
