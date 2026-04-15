from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="customer")   #users
    email = Column(String, nullable=True)
    mobile = Column(String, unique=True)
    full_name = Column(String, nullable=True)
    permissions = Column(String, default="")
    refresh_token = Column(String, nullable=True)
    
    # ✅ Add these properly
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    state_id = Column(Integer, ForeignKey("states.id"))

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    district_id = Column(Integer, ForeignKey("districts.id"))   
    
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)

    models = relationship("MachineModel", back_populates="machine")


class MachineModel(Base):
    __tablename__ = "machine_models"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String)
    machine_id = Column(Integer, ForeignKey("machines.id"))

    machine = relationship("Machine", back_populates="models")

from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from database import Base

class APILog(Base):
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)
    username = Column(String)
    role = Column(String)

    endpoint = Column(String)
    method = Column(String)

    request_payload = Column(Text)
    response_payload = Column(Text)

    status_code = Column(Integer)
    status = Column(String)   # success / failure

    error_message = Column(String)

    ip_address = Column(String)
    user_agent = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

'''class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active")  # active / expired
'''


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String)


class SubCategory(Base):
    __tablename__ = "subcategories"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))


class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"))  # IMPORTANT


class Dealer(Base):
    __tablename__ = "dealers"
    id = Column(Integer, primary_key=True)
    name = Column(String)