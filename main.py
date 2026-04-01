import token
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from database import Base, engine
from models import City, District, Machine, MachineModel, State, User,APILog
from schemas import MachineCreate, MachineUpdate, ModelCreate, ModelUpdate, UserCreate, UserPublic, Token
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.sql import func
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from fastapi import Depends

from models import Category, SubCategory, Issue, Dealer
from schemas import CategoryCreate, SubCategoryCreate, IssueCreate, DealerCreate
from database import SessionLocal
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
import uuid

from auth import (
    get_current_user_from_token,
    require_permission_or_admin,
    validate_password,
    verify_reset_token,
    create_reset_token,
    get_password_hash
)

from auth import (
    create_refresh_token,
    get_db,
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    admin_only,
    require_permission_or_admin
    )

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from database import SessionLocal
from models import APILog
import json

class APILogMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        db = SessionLocal()

        body = await request.body()
        request_payload = body.decode("utf-8") if body else ""

        user_id = None
        username = None
        role = None

        # Try to get user from token
        try:
            if "authorization" in request.headers:
                token = request.headers.get("authorization").split(" ")[1]
                
                # your function
                user = get_current_user_from_token(token, db)

                user_id = user.id
                username = user.username
                role = user.role

        except:
            pass

        try:
            response = await call_next(request)

            status = "success" if response.status_code < 400 else "failure"

            log = APILog(
                user_id=user_id,
                username=username,
                role=role,
                endpoint=request.url.path,
                method=request.method,
                request_payload=request_payload,
                response_payload="success",
                status_code=response.status_code,
                status=status,
                error_message="",
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )

        except Exception as e:

            log = APILog(
                user_id=user_id,
                username=username,
                role=role,
                endpoint=request.url.path,
                method=request.method,
                request_payload=request_payload,
                response_payload="",
                status_code=500,
                status="failure",
                error_message=str(e),
                ip_address=request.client.host,
                user_agent=request.headers.get("user-agent")
            )
            raise e

        db.add(log)
        db.commit()
        db.close()

        return response

SECRET_KEY = "secret123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 5 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Authentication System")
app.add_middleware(APILogMiddleware)
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException


# ---------------- Global HTTP Exception Handler ----------------
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_type": "HTTP_ERROR",
            "status_code": exc.status_code,
            "message": exc.detail
        },
    )


# ---------------- Validation Error Handler ----------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error_type": "VALIDATION_ERROR",
            "message": "Invalid input data",
            "details": exc.errors()
        },
    )
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import FileResponse

@app.get("/")
def serve_frontend():
    return FileResponse("index.html")

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    if user.role not in ["admin", "customer"]:
        raise HTTPException(status_code=400, detail="Role must be admin or customer")

    hashed_password = get_password_hash(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        mobile=user.mobile,
        hashed_password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

@app.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # login using email
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Email or password is incorrect."
        )

    # create tokens
    access_token = create_access_token({
        "sub": user.username,
        "role": user.role
    })

    refresh_token = create_refresh_token({
        "sub": user.username
    })

    # store refresh token
    user.refresh_token = refresh_token
    db.commit()

    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "email": user.email,
            "mobile": user.mobile,
            "full_name": user.full_name,
            "role": user.role,
            "permissions": user.permissions
        }
    }

@app.post("/customer/send-otp")
def send_otp(mobile: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.mobile == mobile).first()

    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    if user.role != "customer":
        raise HTTPException(status_code=403, detail="Only customer allowed")

    otp = "123456"

    return {
        "message": "OTP sent",
        "otp": otp
    }

@app.post("/customer/verify-otp")
def verify_otp(mobile: str, otp: str, db: Session = Depends(get_db)):

    if otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = db.query(User).filter(User.mobile == mobile).first()

    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    # create tokens
    access_token = create_access_token({
        "sub": user.username,
        "role": user.role
    })

    refresh_token = create_refresh_token({
        "sub": user.username
    })

    # save refresh token
    user.refresh_token = refresh_token
    db.commit()

    return {
        "message": "OTP login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "username": user.username,
            "email": user.email,
            "mobile": user.mobile,
            "full_name": user.full_name,
            "role": user.role,
            "permissions": user.permissions
        }
    }

# ---------------- User ----------------
@app.get("/users/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    return user

# ---------------- Admin ----------------
@app.get("/admin/dashboard")
def admin_dashboard(user: User = Depends(admin_only)):
    return {"message": f"Welcome Admin {user.username}"}

@app.put("/admin/set-permissions/{username}")
def set_permissions(
    username: str,
    permissions: str,  # example: "add,edit"
    admin = Depends(admin_only),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(404, "User not found")

    user.permissions = permissions
    db.commit()

    return {
        "message": "Permissions updated",
        "user": username,
        "permissions": permissions
    }


class RefreshTokenRequest(BaseModel):
    refresh_token: str


@app.post("/refresh")
def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.refresh_token == data.refresh_token).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token({
        "sub": user.username,
        "role": user.role
    })

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

from sqlalchemy import desc

@app.get("/admin/users")
def get_all_users(
    current_user = Depends(require_permission_or_admin("add")),
    db: Session = Depends(get_db)
):

    users = db.query(User).order_by(
        desc(User.updated_at)
    ).all()

    return [
        {
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "permissions": user.permissions,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        for user in users
    ]

@app.post("/users")
def create_user(
    user: UserCreate,
    current_user = Depends(require_permission_or_admin("add")),
    db: Session = Depends(get_db)
):
    
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
    status_code=400,
    detail="Cannot create user. Username already exists in system."
)
    validate_password(user.password)   # 👈 ADD THIS

    new_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        role=user.role,
        permissions=""
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

@app.put("/users/{username}")
def update_user(
    username: str,
    email: str,
    full_name: str,
    role: str,
    current_user = Depends(require_permission_or_admin("edit")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(
    status_code=404,
    detail=f"User '{username}' does not exist. Please verify the username."
)

    user.email = email
    user.full_name = full_name
    user.role = role
   # user.updated_at = func.now()   # 👈 ADD THI
    db.commit()

    return {"message": "User updated successfully"}

@app.delete("/users/{username}")
def delete_user(
    username: str,
    current_user = Depends(require_permission_or_admin("delete")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(
    status_code=404,
    detail=f"Cannot delete. User '{username}' not found."
)

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

class ForgotPassword(BaseModel):
    email: str

@app.post("/forgot-password")
def forgot_password(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
    status_code=404,
    detail="This email address is not registered in our system."
)

    reset_token = create_reset_token(user.email)

    return {
        "message": "Password reset token generated",
        "reset_token": reset_token
    }

class ResetPassword(BaseModel):
    token: str
    new_password: str

@app.post("/reset-password")
def reset_password(
    data: ResetPassword,
    db: Session = Depends(get_db)
):
    email = verify_reset_token(data.token)

    if not email:
        raise HTTPException(
    status_code=400,
    detail="Reset token is invalid or expired. Please request a new password reset."
)
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    validate_password(data.new_password)

    user.hashed_password = get_password_hash(data.new_password)

    db.commit()

    return {"message": "Password reset successful"}

@app.post("/states")
def add_state(name: str, db: Session = Depends(get_db)):
    state = State(name=name)
    db.add(state)
    db.commit()
    return {"message": "State added successfully"}

@app.get("/states")
def get_states(db: Session = Depends(get_db)):
    return db.query(State).all()

@app.post("/districts")
def add_district(name: str, state_id: int, db: Session = Depends(get_db)):
    district = District(name=name, state_id=state_id)
    db.add(district)
    db.commit()
    return {"message": "District added successfully"}

@app.get("/districts/{state_id}")
def get_districts(state_id: int, db: Session = Depends(get_db)):
    return db.query(District).filter(District.state_id == state_id).all()

@app.post("/cities")
def add_city(name: str, district_id: int, db: Session = Depends(get_db)):
    city = City(name=name, district_id=district_id)
    db.add(city)
    db.commit()
    return {"message": "City added successfully"}

@app.get("/cities/{district_id}")
def get_cities(district_id: int, db: Session = Depends(get_db)):
    return db.query(City).filter(City.district_id == district_id).all()


# Machines
@app.post("/machines")
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):

    new_machine = Machine(
        name=machine.name,
        description=machine.description
    )

    db.add(new_machine)
    db.commit()
    db.refresh(new_machine)

    return new_machine

@app.get("/machines")
def get_machines(db: Session = Depends(get_db)):

    machines = db.query(Machine).all()

    return machines

@app.put("/machines/{machine_id}")
def update_machine(machine_id: int, machine: MachineUpdate, db: Session = Depends(get_db)):

    db_machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db_machine.name = machine.name
    db_machine.description = machine.description

    db.commit()
    db.refresh(db_machine)

    return db_machine

@app.delete("/machines/{machine_id}")
def delete_machine(machine_id: int, db: Session = Depends(get_db)):

    machine = db.query(Machine).filter(Machine.id == machine_id).first()

    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db.delete(machine)
    db.commit()

    return {"message": "Machine deleted"}

# Models
@app.post("/models")
def create_model(model: ModelCreate, db: Session = Depends(get_db)):

    new_model = MachineModel(
        model_name=model.model_name,
        machine_id=model.machine_id
    )

    db.add(new_model)
    db.commit()
    db.refresh(new_model)

    return new_model

@app.get("/machines/{machine_id}/models")
def get_models(machine_id: int, db: Session = Depends(get_db)):

    models = db.query(MachineModel).filter(
        MachineModel.machine_id == machine_id
    ).all()

    return models

@app.put("/models/{model_id}")
def update_model(model_id: int, model: ModelUpdate, db: Session = Depends(get_db)):

    db_model = db.query(MachineModel).filter(
        MachineModel.id == model_id
    ).first()

    if not db_model:
        raise HTTPException(status_code=404, detail="Model not found")

    db_model.model_name = model.model_name

    db.commit()
    db.refresh(db_model)

    return db_model

@app.delete("/models/{model_id}")
def delete_model(model_id: int, db: Session = Depends(get_db)):

    model = db.query(MachineModel).filter(
        MachineModel.id == model_id
    ).first()

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    db.delete(model)
    db.commit()

    return {"message": "Model deleted"}

@app.get("/api-logs")
def get_logs(db: Session = Depends(get_db)):
    return db.query(APILog).all()

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import engine, get_db

# ---------------- CATEGORY ----------------
@app.post("/category")
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


# ---------------- SUBCATEGORY ----------------
@app.post("/subcategory")
def create_subcategory(sub: SubCategoryCreate, db: Session = Depends(get_db)):
    db_sub = SubCategory(**sub.dict())
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub


@app.get("/subcategory/{category_id}")
def get_subcategory(category_id: int, db: Session = Depends(get_db)):
    data = db.query(SubCategory).filter(SubCategory.category_id == category_id).all()
    return data


# ---------------- ISSUE ----------------
@app.post("/issue")
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    db_issue = Issue(**issue.dict())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue


@app.get("/issue/{subcategory_id}")
def get_issue(subcategory_id: int, db: Session = Depends(get_db)):
    data = db.query(Issue).filter(Issue.subcategory_id == subcategory_id).all()
    return data


# ---------------- DEALER ----------------
@app.post("/dealer")
def create_dealer(dealer: DealerCreate, db: Session = Depends(get_db)):
    db_dealer = Dealer(name=dealer.name)
    db.add(db_dealer)
    db.commit()
    db.refresh(db_dealer)
    return db_dealer