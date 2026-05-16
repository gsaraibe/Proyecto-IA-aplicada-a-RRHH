const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  let data = {};
  try {
    data = await response.json();
  } catch {
    // response might be empty
  }

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}`);
  }

  return data;
}

async function uploadRequest(endpoint, formData) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // No Content-Type header — browser sets it with boundary for multipart
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    // empty response
  }

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}`);
  }

  return data;
}

async function downloadRequest(endpoint, method = 'POST', body = null) {
  const config = {
    method,
    credentials: 'include',
  };
  if (body) {
    config.body = JSON.stringify(body);
    config.headers = { 'Content-Type': 'application/json' };
  }
  const response = await fetch(`${API_URL}${endpoint}`, config);
  if (!response.ok) {
    let msg = `Error ${response.status}`;
    try { const d = await response.json(); msg = d.message || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return response.blob();
}

export const api = {
  get:      (endpoint)        => request(endpoint, { method: 'GET' }),
  post:     (endpoint, body)  => request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:      (endpoint, body)  => request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:    (endpoint, body)  => request(endpoint, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete:   (endpoint)        => request(endpoint, { method: 'DELETE' }),
  upload:   (endpoint, formData) => uploadRequest(endpoint, formData),
  download: (endpoint, method, body) => downloadRequest(endpoint, method, body),
};

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
