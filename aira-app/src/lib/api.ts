/**
 * API client for the Aira backend.
 * All requests go to the backend (http://localhost:5000) which
 * communicates with Supabase Auth on behalf of the app.
 */

// Local dev  → http://localhost:5000
// Change to your deployed backend URL when going to production
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const headers = { 'Content-Type': 'application/json' };

// ─── Auth ────────────────────────────────────────────────────────────────────

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
