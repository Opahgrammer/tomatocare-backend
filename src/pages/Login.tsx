// src/pages/Login.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading("Sedang masuk...");

    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem("access_token", response.access_token);
      login(response.user, response.access_token);

      toast.success("Login Berhasil! Mengalihkan...", {
        id: loadingToast,
      });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Email atau password salah.";
      toast.error(errorMessage, {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ✨ Container Utama: Padding horizontal (px-4) agar tidak menempel di sisi layar HP
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* ✨ Card: Lebar responsif (max-w-md), Padding responsif (p-6 di HP, p-8 di Desktop) */}
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          {/* Ukuran font judul responsif */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sign In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // Padding input diperbesar (py-2.5) untuk area sentuh yang nyaman di HP
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Memproses...' : 'Sign In'}
          </button>
          
          <p className="text-sm text-center text-gray-600 mt-4">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Buat akun
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;