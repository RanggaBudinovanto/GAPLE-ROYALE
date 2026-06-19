/**
 * js/config.js
 * Centralized backend configuration for the client-side app.
 * Change BACKEND_URL to point to your deployed backend or local dev server.
 */

// Auto-detect backend URL:
// 1. If window._BACKEND_URL is set (via script tag), use it
// 2. If on localhost, use local dev server
// 3. Otherwise, use the deployed Railway backend URL
const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

// When deployed on Railway, backend serves frontend too (same origin)
export const BACKEND_URL = window._BACKEND_URL
  || (isDev ? 'http://localhost:3000' : location.origin);

export const API_BASE = `${BACKEND_URL}/api/v1`;

export const SOCKET_URL = BACKEND_URL;

/**
 * Retrieves the stored JWT token for authenticated API calls.
 * The frontend uses a simulated token format; for real backend calls
 * we also try the 'backend_token' key which stores a real JWT.
 */
export function getAuthToken() {
  return sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
}

/**
 * Store the real JWT returned by the backend after login.
 */
export function setBackendToken(token) {
  sessionStorage.setItem('backend_token', token);
}

/**
 * Makes an authenticated API call to the backend.
 * Returns { data, error }.
 */
export async function apiCall(method, path, body = null) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'SERVER_ERROR', message: data.message, status: res.status };
    return { data, status: res.status };
  } catch (err) {
    return { error: 'NETWORK_ERROR', message: 'Tidak dapat terhubung ke server' };
  }
}
