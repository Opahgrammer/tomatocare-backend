// src/pages/Register.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom"; // Hapus 'useNavigate' karena tidak redirect
// Hapus useAuth karena kita tidak auto-login
// import { useAuth } from "../contexts/AuthContext"; 
import { authAPI } from "../services/api";

// ✨ 1. Import Toast
import toast, { Toaster } from 'react-hot-toast';

const Register: React.FC = () => {
  // const nav = useNavigate(); // Tidak dipakai lagi

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Password
    if (password !== confirm) {
      toast.error("Password dan konfirmasi tidak cocok!");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Mendaftarkan akun...");

    try {
      // ✨ 2. Panggil API registrasi
      await authAPI.register({ name, email, password });

      // ✨ 3. Tampilkan Toast Sukses (tanpa pesan redirect)
      toast.success("Registrasi Berhasil! Silakan Sign In.", {
        id: loadingToast,
        duration: 4000, // Tampil lebih lama (4 detik)
      });

      // ✨ 4. Reset Form (Agar user tahu proses selesai)
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");

      // ❌ TIDAK ADA REDIRECT (nav)

    } catch (error: any) {
      // ✨ 5. Tangani Error
      let errorMessage = "Registrasi gagal.";

      if (error.response && error.response.data && error.response.data.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string' && (detail.includes("registered") || detail.includes("exists"))) {
           errorMessage = "Email sudah terdaftar!";
        } else {
           errorMessage = detail;
        }
      }
      
      toast.error(errorMessage, {
        id: loadingToast,
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {/* ✨ Pasang Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="font-semibold text-lg mb-4">Create account</h2>
        
        <input 
            className="border p-2 w-full mb-2" 
            placeholder="Full name" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            required
        />
        <input 
            className="border p-2 w-full mb-2" 
            placeholder="Email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            type="email"
            required
        />
        <input 
            className="border p-2 w-full mb-2" 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
        />
        <input 
            className="border p-2 w-full mb-4" 
            placeholder="Confirm password" 
            type="password" 
            value={confirm} 
            onChange={e=>setConfirm(e.target.value)} 
            required
        />
        
        <button 
          type="submit" 
          className={`w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:bg-gray-400`} 
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Create account"}
        </button>
        
        {/* Link ini yang akan dipakai user untuk pindah ke halaman Login */}
        <p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-indigo-700">Sign in</Link></p>
      </form>
    </div>
  );
};

export default Register;