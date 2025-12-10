import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Leaf, Menu, X, LayoutDashboard, UploadCloud, User } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  
  // State untuk menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    nav("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  // Helper untuk cek link aktif
  const isActive = (path: string) => location.pathname === path;

  return (
    // ✨ Container Utama: Full Width, Sticky, Background Putih
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full font-sans">
      
      {/* ✨ PENTING: Padding di sini (px-4 md:px-8) disamakan dengan Dashboard 
         agar Logo sejajar lurus dengan Judul Dashboard di bawahnya.
         Hapus 'max-w-...' agar navbar melebar penuh.
      */}
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* --- 1. LOGO (Kiri) --- */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl text-green-700 hover:text-green-800 transition-colors"
          onClick={closeMobileMenu}
        >
          <Leaf className="w-6 h-6" />
          <span>PlantDB</span>
        </Link>

        {/* --- 2. MENU DESKTOP (Tengah/Kanan - Hidden di HP) --- */}
        <div className="hidden md:flex items-center gap-8">
          {/* Link Dashboard */}
          <Link 
            to="/" 
            className={`relative group font-medium text-sm transition-colors py-2 ${
              isActive('/') ? 'text-green-700' : 'text-gray-600 hover:text-green-700'
            }`}
          >
            Dashboard
            {/* Animasi Garis Bawah */}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-green-700 transition-all duration-300 ${
              isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </Link>

          {/* Link Upload */}
          <Link 
            to="/upload" 
            className={`relative group font-medium text-sm transition-colors py-2 ${
              isActive('/upload') ? 'text-green-700' : 'text-gray-600 hover:text-green-700'
            }`}
          >
            Upload
            {/* Animasi Garis Bawah */}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-green-700 transition-all duration-300 ${
              isActive('/upload') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </Link>

          {/* Divider Kecil */}
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Info User & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              {user?.email}
            </span>
            <button 
              onClick={onLogout} 
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all shadow-sm active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* --- 3. TOMBOL HAMBURGER (Kanan - Muncul di HP Saja) --- */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* --- 4. MENU MOBILE DROPDOWN (Muncul saat diklik) --- */}
      {/* ✨ TAMPILAN MOBILE SEPERTI BUTTON 
          Menggunakan absolute positioning agar melayang di atas konten dashboard
      */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl border-t border-gray-100 p-4 flex flex-col gap-3 animate-in slide-in-from-top-2">
          
          {/* User Profile Card Mobile */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Link Dashboard (Button Style) */}
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-all active:scale-98 ${
              isActive('/') 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          {/* Link Upload (Button Style) */}
          <Link 
            to="/upload" 
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition-all active:scale-98 ${
              isActive('/upload') 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <UploadCloud className="w-5 h-5" />
            Upload Foto
          </Link>

          {/* Tombol Logout (Button Style - Merah) */}
          <button 
            onClick={onLogout} 
            className="flex items-center justify-center gap-2 w-full p-3 mt-2 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors active:scale-98"
          >
            <LogOut className="w-5 h-5" />
            Keluar Aplikasi
          </button>

        </div>
      )}
    </header>
  );
};

export default Navbar;