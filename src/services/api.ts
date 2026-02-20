// src/api/api.ts

import axios from "axios";

/**
 * ============================================
 * BASE CONFIG
 * ============================================
 */

// Change this to your backend URL if deployed
const API_BASE_URL = "http://127.0.0.1:8000";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ============================================
 * TOKEN HANDLING
 * ============================================
 */

// Save token
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token
export const logout = () => {
  localStorage.removeItem("token");
};

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * ============================================
 * TYPES
 * ============================================
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  token_type: string;
}

/**
 * ============================================
 * AUTH APIs
 * ============================================
 */

// LOGIN
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post("/login", data);

  // Save token automatically
  if (response.data.access_token) {
    setToken(response.data.access_token);
  }

  return response.data;
};

// REGISTER
export const registerUser = async (data: RegisterRequest) => {
  const response = await api.post("/register", data);
  return response.data;
};

/**
 * ============================================
 * DASHBOARD APIs
 * ============================================
 */

// Get dashboard data
export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

/**
 * ============================================
 * USER PROFILE (OPTIONAL)
 * ============================================
 */

export const getProfile = async () => {
  const response = await api.get("/me");
  return response.data;
};

/**
 * ============================================
 * GENERIC HELPERS
 * ============================================
 */

export const isAuthenticated = () => {
  return !!getToken();
};

export default api;
