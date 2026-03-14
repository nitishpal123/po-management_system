from pydantic import BaseModel
from typing import List


class VendorCreate(BaseModel):
    name: str
    contact: str
    rating: float


class ProductCreate(BaseModel):
    name: str
    sku: str
    unit_price: float
    stock_level: int


class POItem(BaseModel):
    product_id: int
    quantity: int
    price: float


class PurchaseOrderCreate(BaseModel):
    reference_no: str
    vendor_id: int
    items: List[POItem]