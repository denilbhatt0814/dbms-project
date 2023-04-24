from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/dbms_project"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# Dependency
def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@app.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).all()
    return customers


@app.get("/customer/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@app.get("/customer/{customer_id}/bills")
def get_customer_bills(customer_id: int, db: Session = Depends(get_db)):
    bills = db.query(Bill).filter(Bill.customer_id == customer_id).all()
    return bills


@app.get("/customer/{customer_id}/favourite_category")
def get_customer_favourite_category(customer_id: int, db: Session = Depends(get_db)):
    category_id = db.query(BillProduct.product.category_id).join(Bill).join(Customer).\
        filter(Customer.customer_id == customer_id).\
        group_by(BillProduct.product.category_id).\
        order_by(func.count().desc()).first()
    if category_id is None:
        raise HTTPException(status_code=404, detail="Customer has no favourite category")
    category = db.query(Category).filter(Category.category_id == category_id[0]).first()
    return category


@app.get("/customer/{customer_id}/average_spend")
def get_customer_average_spend(customer_id: int, db: Session = Depends(get_db)):
    avg_spend = db.query(func.avg(Bill.total_amount)).\
        join(Customer).\
        filter(Customer.customer_id == customer_id).\
        scalar()
    return avg_spend
