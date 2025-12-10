import axios from "axios";
// ✨ Impor semua tipe dari satu tempat (../types)
import { 
  AuthResponse, 
  User, 
  Detection, 
  DiseaseSummary,
  DailyDetectionStat 
} from "../types";

// ===================================================================
// 1. KONFIGURASI AXIOS
// ===================================================================

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===================================================================
// 2. FUNGSI-FUNGSI API
// ===================================================================

// --- API untuk Otentikasi ---
export const authAPI = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  login: (payload: { email: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append("username", payload.email); 
    formData.append("password", payload.password);
    return api.post<AuthResponse>("/auth/login", formData).then((r) => r.data);
  },

  me: () => api.get<User>("/auth/me").then((r) => r.data),
};

// --- API untuk Deteksi dan Statistik ---
export const detectionAPI = {
  detect: (payload: { file: File; notes?: string }) => {
    const formData = new FormData();
    formData.append("file", payload.file);
    if (payload.notes) {
      formData.append("notes", payload.notes);
    }
    return api.post<Detection>("/detect", formData).then((r) => r.data);
  },

  // ✨ Fungsi getDailyStats yang Anda butuhkan
  getDailyStats: (params: { days?: number } = {}) => {
    return api
      .get<DailyDetectionStat[]>("/stats/daily", { params }) 
      .then((r) => r.data);
  },

  getHistory: (params: { skip?: number; limit?: number } = { skip: 0, limit: 10 }) => {
    return api
      .get<Detection[]>("/detections", { params })
      .then((r) => r.data);
  },

  getStats: () => {
    return api.get<DiseaseSummary[]>("/stats").then((r) => r.data);
  },

  getNewDetectionsCount: () => {
    return api.get<number>("/stats/new-count").then((r) => r.data);
  },
};