/**
 * API client for the Aira backend.
 * The API address is selected from the single .env configuration file.
 */

function resolveApiBaseUrl() {
  const configuredUrl = Constants.expoConfig?.extra?.apiUrl;

  if (typeof configuredUrl !== 'string' || !configuredUrl.trim()) {
    throw new Error('PUBLIC_URL must be configured in .env.');
  }

  return configuredUrl.trim().replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();

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
import Constants from 'expo-constants';
