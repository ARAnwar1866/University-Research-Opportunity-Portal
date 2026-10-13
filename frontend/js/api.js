// Change this if your backend runs on a different host or port.
const API_URL = 'http://localhost:3000/api/opportunities';

async function request(path = '', options = {}) {
  let res;
  try {
    res = await fetch(API_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}

const api = {
  getAll: () => request(),
  getOne: (id) => request(`/${id}`),
  create: (body) => request('', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
