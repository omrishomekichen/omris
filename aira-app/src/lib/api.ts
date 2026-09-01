/**
 * API client for the Aira backend.
 * In Expo mobile apps, localhost points to the device itself, not the dev machine.
 * Use the explicit backend URL if set, otherwise derive the local LAN host.
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

function resolveApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developerTool;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:5000`;
  }

  if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
  if (Platform.OS === 'ios') return 'http://localhost:5000';

  return 'http://localhost:5000';
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
