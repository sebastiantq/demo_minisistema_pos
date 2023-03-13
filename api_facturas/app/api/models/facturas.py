from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class Facturas(BaseModel):
    user_id:str
    dni_comprador:str
    created_date:Optional[datetime] = datetime.now()

class Producto(BaseModel):
    product_id:str
    factura_id:str
    cantidad:str
