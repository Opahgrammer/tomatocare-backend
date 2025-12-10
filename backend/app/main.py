# backend/app/main.py
import os
import uuid
import io
import cloudinary
import cloudinary.uploader
from typing import List
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # Masih perlu untuk file statis lain jika ada
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from PIL import Image
from datetime import date 

from . import models, schemas, crud
from .database import engine, get_db
from .auth import (
    create_access_token, 
    authenticate_user, 
    get_current_active_user,
    get_password_hash
)
from .disease_detection import detector

app = FastAPI(title="TomatoCare API", version="1.0.0")

# --- KONFIGURASI CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- KONFIGURASI DATABASE ---
models.Base.metadata.create_all(bind=engine)

# --- KONFIGURASI CLOUDINARY ---
# Pastikan variabel ENV ini sudah ada di file .env
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

@app.get("/", tags=["General"])
def root():
    return {"message": "Welcome to the TomatoCare API"}

@app.get("/health", tags=["General"])
def health_check():
    return {"status": "ok"}

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=schemas.TokenWithUser, tags=["Auth"])
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=payload.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(payload.password)
    user = crud.create_user(db=db, user=payload, hashed_password=hashed_password)
    
    access_token = create_access_token(data={"sub": str(user.id)}) 
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.post("/auth/login", response_model=schemas.TokenWithUser, tags=["Auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.get("/auth/me", response_model=schemas.UserOut, tags=["Auth"])
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

# --- DETECTION ENDPOINT (MODIFIED FOR CLOUDINARY) ---

@app.post("/detect", response_model=schemas.Detection, tags=["Detection"])
async def create_detection_record(
    file: UploadFile = File(...),
    notes: str | None = Form(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    # 1. Validasi File
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be a valid image.")
    
    # 2. Baca file ke memory
    contents = await file.read()
    
    # Validasi apakah gambar valid (bisa dibuka oleh PIL)
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    # 3. Proses Deteksi AI (YOLO)
    if not detector:
        raise HTTPException(status_code=503, detail="Detection service is unavailable.")

    detection_result = detector.detect_disease(image)
    if not detection_result:
        disease, confidence = "Healthy", 1.0 
    else:
        disease, confidence = detection_result

    # 4. ✨ UPLOAD KE CLOUDINARY ✨
    image_url = None # Default jika upload gagal
    try:
        # Kita harus mereset pointer file stream agar bisa dibaca ulang oleh Cloudinary
        # Karena sebelumnya sudah dibaca oleh 'contents = await file.read()'
        # Opsi terbaik: upload 'contents' (bytes) langsung
        
        # Upload ke folder 'tomatocare_uploads' di Cloudinary
        upload_result = cloudinary.uploader.upload(contents, folder="tomatocare_uploads")
        
        # Ambil URL secure (https)
        image_url = upload_result.get("secure_url")
        print(f"✅ Gambar berhasil diupload ke Cloudinary: {image_url}")
        
    except Exception as e:
        print(f"❌ Gagal upload ke Cloudinary: {e}")
        # Jika gagal upload, kita bisa return error atau tetap simpan data tanpa gambar
        raise HTTPException(status_code=500, detail=f"Failed to upload image to cloud storage: {str(e)}")

    # 5. Simpan Data ke Database Aiven
    # image_path sekarang berisi URL lengkap (https://res.cloudinary.com/...)
    db_detection = crud.create_detection(
        db=db,
        user_id=current_user.id,
        disease=disease,
        confidence=confidence,
        image_path=image_url, 
        notes=notes,
    )
    return db_detection

# --- DATA & STATS ENDPOINTS ---

@app.get("/detections", response_model=List[schemas.Detection], tags=["Detection"])
def get_user_detections(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    detections = crud.get_detections_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return detections

@app.get("/stats", response_model=List[schemas.DiseaseSummary], tags=["Statistics"])
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    summary = crud.get_stats_by_user(db, user_id=current_user.id)
    return summary

@app.get("/stats/new-count", response_model=int, tags=["Statistics"])
def get_new_detections_count(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    count = crud.get_new_detections_count_by_user(db, user_id=current_user.id)
    return count

@app.get("/stats/daily", response_model=List[schemas.DailyDetectionStat], tags=["Statistics"])
def get_user_daily_stats(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    daily_data_tuples = crud.get_daily_detection_counts_by_user(
        db, user_id=current_user.id, days_limit=days
    )
    return [{"day": d, "cases": c} for d, c in daily_data_tuples]