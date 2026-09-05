import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API client for the Aira backend.
 * The API address is selected from the configured Expo environment variables.
 */

function resolveApiBaseUrl() {
  const configuredUrl =
    Constants.expoConfig?.extra?.apiUrl ??
    process.env.EXPO_PUBLIC_API_URL;

  if (typeof configuredUrl !== 'string' || !configuredUrl.trim()) {
    throw new Error(
      'Set EXPO_PUBLIC_API_URL or PUBLIC_URL in aira-app/.env before starting the app.',
    );
  }

  const apiUrl = configuredUrl.trim().replace(/\/$/, '');

  // Android emulators run in a separate network namespace. Their loopback
  // address is the emulator, not this development machine.
  if (Platform.OS === 'android') {
    return apiUrl.replace(/:\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/, '://10.0.2.2');
  }

  return apiUrl;
}

const API_BASE_URL = resolveApiBaseUrl();

const headers = { 'Content-Type': 'application/json' };

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function healthCheck() {
  const res = await fetch(`${API_BASE_URL}/api/health`, {
    method: 'GET',
    headers,
  });
  return res.json();
}

export async function apiLogFirebaseToken(token: string) {
  await fetch(`${API_BASE_URL}/api/push-notification-token`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ token }),
  });
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function apiSendLoginOtp(email: string) {
  const res = await fetch(`${API_BASE_URL}/api/send-login-otp`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function apiVerifyLoginOtp(email: string, verificationCode: string) {
  const res = await fetch(`${API_BASE_URL}/api/verify-login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, verificationCode }),
  });
  return res.json();
}

export async function apiVerifyRegistrationOtp(
  email: string,
  verificationCode: string,
) {
  const res = await fetch(`${API_BASE_URL}/api/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, verificationCode }),
  });
  return res.json();
}

export async function apiRegister(
  fullName: string,
  email: string,
  password: string,
) {
  const res = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fullName, email, password }),
  });
  return res.json();
}

export async function apiLogout(token?: string) {
  await fetch(`${API_BASE_URL}/api/logout`, {
    method: 'POST',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
}

export async function apiForgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function apiMe(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}


export async function dashboardkpis(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin-dashboard-kpis`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}
export async function  apiGetAdminOrders(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin-orders`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiVerifyOrderPayment(orderId: string, token?: string) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin-orders/${encodeURIComponent(orderId)}/verify-payment`,
    {
      method: 'PATCH',
      headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    },
  );
  return res.json();
}

export async function apiUpdateOrderStatus(
  orderId: string,
  status: string,
  token?: string,
  profile?: unknown,
) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin-orders/${encodeURIComponent(orderId)}/status`,
    {
      method: 'PATCH',
      headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ status, profile }),
    },
  );
  return res.json();
}

export async function apiDeleteOrder(
  orderId: string,
  token?: string,
  profile?: unknown,
) {
  const res = await fetch(
    `${API_BASE_URL}/api/admin-orders/${encodeURIComponent(orderId)}`,
    {
      method: 'DELETE',
      headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ profile }),
    },
  );
  return res.json();
}


export async function apiGetRecentPendingOrders(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/recent-pending-orders`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function dashboardreviews(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin-dashboard-reviews`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetAdminLatestReviews(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin-dashboard-latest-reviews`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetRecentReviews(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/reviews/recent`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiGetAdminReviews(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin-reviews`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiDeleteAdminReview(id: string, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error?.message || 'Network error deleting review' };
  }
}






/* menu Routes */


export async function apiGetMenuItems(token?: string) {
  const res = await fetch(`${API_BASE_URL}/api/menu-items`, {
    method: 'GET',
    headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) return null;
  return res.json();
}
