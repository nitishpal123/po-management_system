from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import purchase_orders
from .database import engine, Base

# Create all database tables based on models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PO Management API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(purchase_orders.router)