from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import UserModel
from app.schemas import UserCreateRequest, UserResponse
from app.routers.auth import require_admin, hash_password

router = APIRouter(prefix="/api/users", tags=["User Management"])

@router.get("", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_admin)
):
    users = db.query(UserModel).order_by(UserModel.id.asc()).all()
    return [
        UserResponse(
            id=u.id,
            username=u.username,
            role=u.role,
            name=u.name,
            created_at=u.created_at.isoformat() if u.created_at else None
        )
        for u in users
    ]

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreateRequest,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_admin)
):
    existing = db.query(UserModel).filter(UserModel.username == user_in.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{user_in.username}' is already registered."
        )

    new_user = UserModel(
        username=user_in.username,
        password_hash=hash_password(user_in.password),
        role=user_in.role,
        name=user_in.name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        role=new_user.role,
        name=new_user.name,
        created_at=new_user.created_at.isoformat() if new_user.created_at else None
    )
