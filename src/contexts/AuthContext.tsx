// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
// Pastikan path '../types' ini benar, sesuaikan jika file types Anda ada di folder lain
import type { User } from '../types'; 
import { authAPI } from '../services/api';

// --- Tipe Data untuk Context ---
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  register: (userData: User, token: string) => void;
}

// --- Konstanta untuk Kunci localStorage ---
const TOKEN_KEY = "access_token";

// --- Pembuatan Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Komponen Provider ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      // Jika ada token, coba validasi ke backend
      if (token) {
        try {
          const currentUser = await authAPI.me();
          setUser(currentUser);
        } catch (error) {
          console.error("Sesi tidak valid atau kadaluarsa, token dihapus.");
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } else {
        // Jika tidak ada token, pastikan user null
        setUser(null);
      }
      setIsLoading(false);
    };

    validateToken();
  }, [token]);

  // Fungsi Login: Simpan state & token
  const login = (userData: User, newToken: string) => {
    setToken(newToken);
    setUser(userData);
    // Token sudah disimpan di localStorage oleh Login.tsx, tapi bisa juga di sini untuk redundansi aman
    localStorage.setItem(TOKEN_KEY, newToken);
  };
  
  // Fungsi Register: Simpan state & token (mirip login)
  const register = (userData: User, newToken: string) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  // Fungsi Logout: Hapus semua data sesi
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login');
  };

  const value = { user, token, isLoading, login, logout, register };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 font-medium animate-pulse">Memuat sesi...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook untuk menggunakan Context ---
// Pastikan komponen yang menggunakan hook ini berada di dalam <AuthProvider>
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};