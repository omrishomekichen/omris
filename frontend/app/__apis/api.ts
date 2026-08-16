import { DEFAULT_MENU_ITEMS } from "../data/defaultMenu";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const Api = {
  health: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return await response.json();
    } catch {
      return { status: "error" };
    }
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (fullName: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ fullName, email, password }),
    });
    return response.json();
  },

  verifyEmail: async (email: string, verificationCode: string) => {
    const response = await fetch(`${API_BASE_URL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, verificationCode }),
    });
    return response.json();
  },

  verifyLogin: async (email: string, verificationCode: string) => {
    const response = await fetch(`${API_BASE_URL}/api/verify-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: email.trim(),
        verificationCode: verificationCode.trim(),
      }),
    });
    return response.json();
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  resetPassword: async (
    email: string,
    verificationCode: string,
    newPassword: string,
  ) => {
    const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, verificationCode, newPassword }),
    });
    return response.json();
  },

  menu: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return DEFAULT_MENU_ITEMS;
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
  },
  placeOrder: async (
    email: string,
    orderItems: any[],
    shippingAddress: string,
    paymentMethod: string,
    utrNumber: string,
    totalPrice: number,
    screenshot: File | null,
  ) => {
    const formData = new FormData();
    if (email) formData.append("email", email);
    formData.append("orderItems", JSON.stringify(orderItems));
    formData.append("shippingAddress", shippingAddress);
    formData.append("paymentMethod", paymentMethod);
    formData.append("utrNumber", utrNumber);
    formData.append("totalPrice", totalPrice.toString());
    if (screenshot) {
      formData.append("paymentScreenshot", screenshot);
    }

    const response = await fetch(`${API_BASE_URL}/api/place-order`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    return response.json();
  },
  orders: async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/user/orders`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    return data;
  },
  getOrderById: async (id: string) => {
    const response = await fetch(
      `${API_BASE_URL}/api/user/orders/${encodeURIComponent(id)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    return data;
  },
  me: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return { status: "error", success: false };
      }

      return await response.json();
    } catch {
      return { status: "error", success: false };
    }
  },
  logout: async () => {
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
  },
};

export default Api;
