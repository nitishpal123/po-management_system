from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..schemas import PurchaseOrderCreate
from ..services.po_service import create_purchase_order

router = APIRouter(prefix="/purchase-orders")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_po(po: PurchaseOrderCreate, db: Session = Depends(get_db)):

    order = create_purchase_order(db, po)

    return {
        "message": "Purchase Order Created",
        "po_id": order.id
    }