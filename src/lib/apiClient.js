// Default to the backend server in local development.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Unable to reach the API server at ${API_BASE_URL}. Make sure the backend is running.`);
  }

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function apiDownload(path, { method = 'GET', body, token } = {}) {
  const headers = {
    Accept: 'application/pdf',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Unable to reach the API server at ${API_BASE_URL}. Make sure the backend is running.`);
  }

  if (!response.ok) {
    const text = await response.text();
    const data = text ? safeJsonParse(text) : null;
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.blob();
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export {
  API_BASE_URL,
  apiDownload,
  apiRequest,
};
