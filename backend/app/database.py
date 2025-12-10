# backend/app/database.py

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
import ssl # ✨ WAJIB

load_dotenv()

# Ambil URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in .env")

# ✨ 1. HAPUS parameter ?ssl-mode=... dari string URL (biar settingan manual kita yang dipakai)
if "?" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]

# ✨ 2. Pastikan driver pymysql
if DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://")

# ✨ 3. KONFIGURASI SSL YANG LEBIH KUAT
# Kita buat context SSL yang mengabaikan pemeriksaan hostname
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Masukkan ke connect_args
connect_args = {
    "ssl": ssl_context,
    "connect_timeout": 60  # Kita panjangkan waktu tunggu jadi 60 detik
}

# Buat Engine
engine = create_engine(
    DATABASE_URL,
    echo=True, # Kita set True biar kelihatan log-nya di terminal
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args=connect_args # ✨ PENTING
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Tes Koneksi
try:
    print("⏳ Sedang mencoba koneksi ke Aiven...")
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("✅ BERHASIL CONNECT KE AIVEN!")
except Exception as e:
    print(f"❌ GAGAL CONNECT: {e}")