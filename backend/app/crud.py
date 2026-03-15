from sqlalchemy.orm import Session
from . import models


def create_vendor(db: Session, vendor):
    new_vendor = models.Vendor(**vendor.dict())
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)
    return new_vendor


def get_vendors(db: Session):
    return db.query(models.Vendor).all()