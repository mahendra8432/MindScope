const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic API function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` }),
    },
  };

  console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`❌ API Error: ${response.status}`, errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  console.log(`✅ API Success: ${options.method || 'GET'} ${url}`, result);
  return result;
};

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),
  
  login: (email: string, password: string) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  getMe: () => apiCall('/auth/me'),
  
  updateProfile: (data: any) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Mood API
export const moodAPI = {
  getAll: (params?: { page?: number; limit?: number; moodType?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    return apiCall(`/moods${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => apiCall(`/moods/${id}`),
  
  create: (data: any) => apiCall('/moods', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiCall(`/moods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiCall(`/moods/${id}`, {
    method: 'DELETE',
  }),
};

// Journal API
export const journalAPI = {
  getAll: (params?: { page?: number; limit?: number; category?: string; mood?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    return apiCall(`/journals${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => apiCall(`/journals/${id}`),
  
  create: (data: any) => apiCall('/journals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiCall(`/journals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiCall(`/journals/${id}`, {
    method: 'DELETE',
  }),
};

// Goals API
export const goalsAPI = {
  getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; priority?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    return apiCall(`/goals${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => apiCall(`/goals/${id}`),
  
  create: (data: any) => apiCall('/goals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiCall(`/goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  toggleMilestone: (goalId: string, milestoneId: string) => apiCall(`/goals/${goalId}/milestones/${milestoneId}`, {
    method: 'PATCH',
  }),
  
  delete: (id: string) => apiCall(`/goals/${id}`, {
    method: 'DELETE',
  }),
};

// Habits API
export const habitsAPI = {
  getAll: (params?: { page?: number; limit?: number; category?: string; isActive?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    return apiCall(`/habits${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => apiCall(`/habits/${id}`),
  
  create: (data: any) => apiCall('/habits', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiCall(`/habits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  toggleCompletion: (id: string, data: { date: string; note?: string }) => apiCall(`/habits/${id}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiCall(`/habits/${id}`, {
    method: 'DELETE',
  }),
};

// Tips API
export const tipsAPI = {
  getAll: (params?: { page?: number; limit?: number; category?: string; difficulty?: string; featured?: boolean; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    return apiCall(`/tips${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id: string) => apiCall(`/tips/${id}`),
  
  create: (data: any) => apiCall('/tips', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiCall(`/tips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  complete: (id: string) => apiCall(`/tips/${id}/complete`, {
    method: 'PATCH',
  }),
  
  delete: (id: string) => apiCall(`/tips/${id}`, {
    method: 'DELETE',
  }),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (params?: { days?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    return apiCall(`/analytics/dashboard${queryString ? `?${queryString}` : ''}`);
  },
  
  getMoodTrends: (params?: { days?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const queryString = queryParams.toString();
    return apiCall(`/analytics/mood-trends${queryString ? `?${queryString}` : ''}`);
  },
};