from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())  # ✨ tambah created_at

    # ORM-level cascade hanya berlaku saat delete via session,
    # passive_deletes=True supaya DB handle ON DELETE CASCADE dengan efisien
    detections = relationship(
        "Detection",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  # ✨ ondelete
    disease = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    image_path = Column(String(255))
    notes = Column(String(255))  # opsional
    created_at = Column(DateTime, nullable=False, server_default=func.now())  # ✨ default DB

    owner = relationship("User", back_populates="detections")

# Index untuk performa dashboard/riwayat
Index("ix_det_user_created_at", Detection.user_id, Detection.created_at.desc())
Index("ix_det_user_disease", Detection.user_id, Detection.disease)
