// src/types/index.ts

// =======================================================
// Tipe untuk Autentikasi dan User
// =======================================================

/**
 * Merepresentasikan data pengguna dari tabel 'users'
 */
export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string; // Atau Date jika Anda mengonversinya
};

/**
 * Tipe untuk data yang dikirim oleh AuthContext
 * (Catatan: Definisi fungsi login/register di sini mungkin berbeda
 * dari implementasi aktual di AuthContext.tsx, tapi tipe dasarnya OK)
 */
export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

/**
 * Tipe untuk respons dari endpoint /login atau /register
 */
export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};


// =======================================================
// Tipe untuk Data Deteksi & Dashboard
// =======================================================

/**
 * Merepresentasikan satu baris data dari tabel 'detections'
 */
export type Detection = {
  id: number;
  user_id: number;
  disease: string;
  confidence: number;
  image_path: string | null;
  notes: string | null;
  created_at: string; // Atau Date
};

/**
 * Tipe untuk data rekap statistik penyakit (hasil GROUP BY)
 */
export type DiseaseSummary = {
  disease_name: string;
  count: number;
};

// ✨ TAMBAHKAN TIPE INI
/**
 * Tipe untuk data statistik deteksi harian (hasil endpoint /stats/daily)
 */
export type DailyDetectionStat = {
  day: string; // Format YYYY-MM-DD dari backend
  cases: number;
};

