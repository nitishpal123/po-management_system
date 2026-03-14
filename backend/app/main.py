from fastapi import FastAPI
from .routes import purchase_orders

app = FastAPI(
    title="PO Management API"
)

app.include_router(purchase_orders.router)