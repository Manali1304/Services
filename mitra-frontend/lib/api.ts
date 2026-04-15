// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token Management
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') return localStorage.getItem('access_token');
  return null;
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// API Request Helper
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API request failed');
  }
  
  return response.json();
};

// Auth APIs
export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }
  
  const data = await response.json();
  setAuthToken(data.access_token);
  return data;
};

export const register = async (userData: {
  username: string;
  password: string;
  email: string;
  mobile: string;
  full_name: string;
  role: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }
  
  return response.json();
};

// User APIs
export const getUsers = () => apiRequest('/admin/users');
export const createUser = (userData: any) => apiRequest('/users', { method: 'POST', body: JSON.stringify(userData) });
export const updateUser = (username: string, data: any) => apiRequest(`/users/${username}?email=${encodeURIComponent(data.email)}&full_name=${encodeURIComponent(data.full_name)}&role=${data.role}`, { method: 'PUT' });
export const deleteUser = (username: string) => apiRequest(`/users/${username}`, { method: 'DELETE' });

// State, District, City APIs
export const getStates = () => apiRequest('/states');
export const getDistricts = (stateId: number) => apiRequest(`/districts/${stateId}`);
export const getCities = (districtId: number) => apiRequest(`/cities/${districtId}`);

// Machine APIs
export const getMachines = () => apiRequest('/machines');
export const createMachine = (data: any) => apiRequest('/machines', { method: 'POST', body: JSON.stringify(data) });
export const updateMachine = (id: number, data: any) => apiRequest(`/machines/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMachine = (id: number) => apiRequest(`/machines/${id}`, { method: 'DELETE' });