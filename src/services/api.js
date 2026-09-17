/**
 * Central API Client for BuildSync Frontend
 * Handles communication with the backend with credentials (HTTP-only cookies).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // CRITICAL: send and receive HTTP-only cookies
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === 'object' && (data.error || data.message)) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or parse error
    throw new ApiError(error.message || 'Network connection failed', 0, null);
  }
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),

  // Auth APIs
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
  },

  // Properties APIs
  properties: {
    getAll: (query = {}) => {
      const params = new URLSearchParams();
      if (query.status) params.append('status', query.status);
      const qs = params.toString();
      return api.get(`/properties${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => api.get(`/properties/${id}`),
    create: (data) => api.post('/properties', data),
    update: (id, data) => api.put(`/properties/${id}`, data),
    delete: (id) => api.delete(`/properties/${id}`),
  },

  // Units APIs
  units: {
    getAll: (propertyId) => api.get(`/properties/${propertyId}/units`),
    getById: (propertyId, unitId) => api.get(`/properties/${propertyId}/units/${unitId}`),
    create: (propertyId, data) => api.post(`/properties/${propertyId}/units`, data),
    update: (propertyId, unitId, data) => api.put(`/properties/${propertyId}/units/${unitId}`, data),
    delete: (propertyId, unitId) => api.delete(`/properties/${propertyId}/units/${unitId}`),
  },

  // Leases APIs
  leases: {
    getAll: (query = {}) => {
      const params = new URLSearchParams();
      if (query.propertyId) params.append('propertyId', query.propertyId);
      if (query.status) params.append('status', query.status);
      const qs = params.toString();
      return api.get(`/leases${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => api.get(`/leases/${id}`),
    create: (data) => api.post('/leases', data),
    update: (id, data) => api.put(`/leases/${id}`, data),
    delete: (id) => api.delete(`/leases/${id}`),
    getTenantLease: () => api.get('/tenant/lease'),
  },

  // Bills APIs
  bills: {
    getAll: (query = {}) => {
      const params = new URLSearchParams();
      if (query.status) params.append('status', query.status);
      if (query.billingMonth) params.append('billingMonth', query.billingMonth);
      if (query.propertyId) params.append('propertyId', query.propertyId);
      const qs = params.toString();
      return api.get(`/bills${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => api.get(`/bills/${id}`),
    create: (data) => api.post('/bills', data),
    getTenantBills: (query = {}) => {
      const params = new URLSearchParams();
      if (query.status) params.append('status', query.status);
      if (query.billingMonth) params.append('billingMonth', query.billingMonth);
      const qs = params.toString();
      return api.get(`/tenant/bills${qs ? `?${qs}` : ''}`);
    },
  },

  // Payments APIs
  payments: {
    getAll: (query = {}) => {
      const params = new URLSearchParams();
      if (query.billId) params.append('billId', query.billId);
      if (query.status) params.append('status', query.status);
      const qs = params.toString();
      return api.get(`/payments${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => api.get(`/payments/${id}`),
    create: (data) => api.post('/payments', data),
    verify: (id) => api.patch(`/payments/${id}/verify`),
    getReceipt: (id) => api.get(`/payments/${id}/receipt`),
  },

  // Notifications APIs
  notifications: {
    getAll: (limit = 50) => api.get(`/notifications?limit=${limit}`),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all'),
  },
};

export default api;
