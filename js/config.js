const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

export const BACKEND_URL = window._BACKEND_URL
  || (isDev ? 'http://localhost:3000' : location.origin);

export const API_BASE = `${BACKEND_URL}/api/v1`;

export const SOCKET_URL = BACKEND_URL;

export function getAuthToken() {
  return sessionStorage.getItem('backend_token') || sessionStorage.getItem('gaple_token');
}

export function setBackendToken(token) {
  sessionStorage.setItem('backend_token', token);
}

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
