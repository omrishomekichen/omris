const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const Api = {
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (fullName: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    return response.json();
  },
  verifyEmail: async (email: string, verificationCode: string) => {
    const response = await fetch(`${API_BASE_URL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, verificationCode }),
    });
    return response.json();
  },

  verifyLogin: async (email: string, verificationCode: string) => {
    const response = await fetch(`${API_BASE_URL}/api/verify-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), verificationCode: verificationCode.trim() }),
    });
    return response.json();
  },
};

export default Api;
