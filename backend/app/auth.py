# backend/app/auth.py

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from .database import get_db
from .models import User
from .schemas import TokenData

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "devkey")
ALGORITHM = os.getenv("JWT_ALGO", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# ---------- Helpers ----------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    # Impor crud di dalam fungsi
    from . import crud
    
    user = crud.get_user_by_email(db, email) # Gunakan fungsi dari crud
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

# ---------- Dependency ----------
async def get_current_active_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency untuk mendapatkan user yang sedang aktif berdasarkan token.
    """
    # Impor crud di dalam fungsi
    from . import crud 
    
    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub") # user_id sebagai string
        if sub is None:
            raise auth_error
        token_data = TokenData(sub=str(sub))
        user_id = int(token_data.sub)
    except (JWTError, ValueError):
        raise auth_error

    user = crud.get_user_by_id(db, user_id) # Gunakan fungsi dari crud
    if user is None:
        raise auth_error
    return user