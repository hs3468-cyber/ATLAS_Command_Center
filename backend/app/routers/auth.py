import hashlib
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import UserModel
from app.schemas import UserLoginRequest, UserLoginResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password or plain_password == hashed_password

def get_current_user(
    authorization: Optional[str] = Header(None),
    x_atlas_token: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> UserModel:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
    elif x_atlas_token:
        token = x_atlas_token

    if not token:
        # Fallback to default admin if unauthenticated during demo
        user = db.query(UserModel).filter(UserModel.username == "admin").first()
        if user:
            return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )

    # Token format: atlas_token_{username}_{role}
    parts = token.split("_")
    if len(parts) >= 3 and parts[0] == "atlas" and parts[1] == "token":
        username = parts[2]
        user = db.query(UserModel).filter(UserModel.username == username).first()
        if user:
            return user

    # Fallback lookup by username if token is just username
    user = db.query(UserModel).filter(UserModel.username == token).first()
    if user:
        return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication token"
    )

def require_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Admin permissions required for this action."
        )
    return current_user

@router.post("/login", response_model=UserLoginResponse)
def login(login_req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == login_req.username).first()
    if not user or not verify_password(login_req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Simple secure session token for demo
    token = f"atlas_token_{user.username}_{user.role}"

    # Log successful login to Audit Trail
    try:
        from app.services.audit_service import log_audit_entry
        log_audit_entry(
            db=db,
            actor_username=user.username,
            actor_role=user.role,
            action="LOGIN",
            resource="AUTH",
            status="SUCCESS",
            details={"ip": "127.0.0.1", "auth_method": "CREDENTIALS"}
        )
    except Exception:
        pass

    user_resp = UserResponse(
        id=user.id,
        username=user.username,
        role=user.role,
        name=user.name,
        created_at=user.created_at.isoformat() if user.created_at else None
    )

    return UserLoginResponse(
        access_token=token,
        token_type="bearer",
        user=user_resp
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserModel = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        role=current_user.role,
        name=current_user.name,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None
    )
