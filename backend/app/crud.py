# backend/app/crud.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
from sqlalchemy import func, Date, cast  # ✨ TAMBAHKAN 'Date' dan 'cast'
from datetime import datetime, timedelta, date # ✨ TAMBAHKAN 'date'

from . import models, schemas
# ✨ PERBAIKAN: Impor 'auth' DIHAPUS DARI SINI
# (Ini adalah inti masalahnya)

# ==========================================================
# CRUD untuk User & Autentikasi
# ==========================================================

def get_user_by_email(db: Session, email: str) -> models.User | None:
    """Mencari user berdasarkan email."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> models.User | None:
    """Mencari user berdasarkan ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str) -> models.User:
    """Membuat user baru di database."""
    
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ==========================================================
# CRUD untuk Detection (Deteksi)
# ==========================================================

def create_detection(
    db: Session, 
    user_id: int, 
    disease: str, 
    confidence: float, 
    image_path: str, 
    notes: str | None
) -> models.Detection:
    """Menyimpan hasil deteksi baru ke database."""
    db_detection = models.Detection(
        user_id=user_id,
        disease=disease,
        confidence=confidence,
        image_path=image_path,
        notes=notes
    )
    db.add(db_detection)
    db.commit()
    db.refresh(db_detection)
    return db_detection

# ==========================================================
# CRUD untuk Dashboard
# ==========================================================

def get_detections_by_user(
    db: Session, user_id: int, skip: int = 0, limit: int = 10
) -> List[models.Detection]:
    """UNTUK TABEL DASHBOARD: Mengambil riwayat deteksi terbaru."""
    return (
        db.query(models.Detection)
        .filter(models.Detection.user_id == user_id)
        .order_by(models.Detection.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_stats_by_user(db: Session, user_id: int):
    """UNTUK KARTU & PIE CHART: Mengambil rekap jumlah per penyakit."""
    summary_data = (
        db.query(
            models.Detection.disease.label("disease_name"),
            func.count(models.Detection.id).label("count")
        )
        .filter(models.Detection.user_id == user_id)
        .group_by(models.Detection.disease)
        .order_by(func.count(models.Detection.id).desc())
        .all()
    )
    return summary_data

def get_new_detections_count_by_user(db: Session, user_id: int) -> int:
    """UNTUK KARTU 'NEW DETECTIONS': Menghitung deteksi dalam 24 jam terakhir."""
    time_threshold = datetime.utcnow() - timedelta(days=1)
    
    return (
        db.query(models.Detection)
        .filter(
            models.Detection.user_id == user_id,
            models.Detection.created_at >= time_threshold
        )
        .count()
    )
    
# ✨ TAMBAHKAN FUNGSI BARU INI DI PALING BAWAH
def get_daily_detection_counts_by_user(db: Session, user_id: int, days_limit: int = 7) -> List[tuple[date, int]]:
    """
    Mengambil jumlah deteksi per hari untuk user tertentu,
    mulai dari 'days_limit' hari yang lalu hingga hari ini.
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=days_limit - 1) # Hitung tanggal mulai

    # Query untuk menghitung deteksi per hari
    daily_counts = (
        db.query(
            cast(models.Detection.created_at, Date).label("detection_date"), 
            func.count(models.Detection.id).label("count")
        )
        .filter(
            models.Detection.user_id == user_id,
            cast(models.Detection.created_at, Date) >= start_date,
            cast(models.Detection.created_at, Date) <= end_date
        )
        .group_by(cast(models.Detection.created_at, Date))
        .order_by(cast(models.Detection.created_at, Date)) 
        .all()
    )
    
    # Buat dictionary untuk menyimpan hasil (tanggal -> count)
    results_dict = {d: c for d, c in daily_counts}
    
    # Isi hari yang tidak ada data dengan count = 0
    all_days_data = []
    current_date = start_date
    while current_date <= end_date:
        count = results_dict.get(current_date, 0) # Ambil count, default 0
        all_days_data.append((current_date, count))
        current_date += timedelta(days=1)
        
    return all_days_data