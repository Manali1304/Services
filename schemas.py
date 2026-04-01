from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    role: str                  # = "user","admin","service_manager","engineer"
    email: Optional[str] = None
    mobile: str 
    full_name: Optional[str] = None

class UserPublic(BaseModel):
    username: str
    role: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    full_name: Optional[str] = None

from pydantic import BaseModel
from typing import Optional

class UserLoginResponse(BaseModel):
    username: str
    email: str
    full_name: Optional[str]
    role: str
    permissions: Optional[str]

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserLoginResponse 


from pydantic import BaseModel


class MachineCreate(BaseModel):
    name: str
    description: str


class MachineUpdate(BaseModel):
    name: str
    description: str


class ModelCreate(BaseModel):
    model_name: str
    machine_id: int


class ModelUpdate(BaseModel):
    model_name: str



from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str

class SubCategoryCreate(BaseModel):
    name: str
    category_id: int

class IssueCreate(BaseModel):
    title: str
    description: str
    subcategory_id: int   # IMPORTANT

class DealerCreate(BaseModel):
    name: str