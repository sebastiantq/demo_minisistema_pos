from typing import Optional
from pydantic import BaseModel

class Inventario(BaseModel):
    nombre:str
    unidades_disponibles:int
    precio:float
