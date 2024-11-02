from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

DATABASE_URL = "sqlite:///./uploads.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class FileUpload(Base):
    __tablename__ = "file_uploads"

    filename = Column(String, primary_key=True, index=True)
    upload_date = Column(DateTime, default=datetime.datetime)

# Create tables
Base.metadata.create_all(bind=engine)
