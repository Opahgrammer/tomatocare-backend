# backend/app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

# ==========================================================
# 1. Skema untuk User & Autentikasi
# (Ini yang hilang dari kodingan Anda sebelumnya)
# ==========================================================

# Skema untuk membuat user baru (dipakai di /auth/register)
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# Skema untuk data user yang dikirim ke frontend (tanpa password)
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True  # Mengizinkan Pydantic membaca dari model ORM

# Skema untuk data di dalam token JWT
class TokenData(BaseModel):
    sub: Optional[str] = None # 'sub' (subject) adalah user_id

# Skema untuk response /auth/login & /auth/register
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenWithUser(Token):
    user: UserOut

# ==========================================================
# 2. Skema untuk Deteksi & Dashboard
# (Ini yang sudah Anda kirim dan sudah benar)
# ==========================================================

# Skema untuk data deteksi lengkap (cocok dengan tabel 'detections')
class Detection(BaseModel):
    id: int
    user_id: int
    disease: str
    confidence: float
    image_path: str | None
    notes: str | None
    created_at: datetime

    class Config:
        from_attributes = True

# Skema for data statistik (hasil GROUP BY)
class DiseaseSummary(BaseModel):
    disease_name: str
    count: int
    
    class Config:
        from_attributes = True
        
# ✨ TAMBAHKAN SKEMA BARU INI DI PALING BAWAH
class DailyDetectionStat(BaseModel):
    day: date  # Akan dikirim sebagai string "YYYY-MM-DD"
    cases: int