import fastapi
from app.api.schemas.facturas import facturassEntity, facturasEntity
from app.api.models.facturas import Facturas, Producto
from app.api.config.db import conn
from app.api.utils.acces_security import get_current_username
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from bson import ObjectId
from app.api.utils.jsonreturn import *
from datetime import datetime

facturas = APIRouter()

#Metodos
def post(object,db):
    try:
        object = object.dict()
        object_id  = db.insert_one(object).inserted_id
        object = db.find_one({'_id':object_id})
        object = dict(object)
        object['_id'] = str(object['_id'])
        data_object['message'] = object
        return data_object
    except Exception as e:  
        error['message'] = str(e)
        return error

def get(key,db,id):
    try:
        if(key=='_id'):
            object = db.find_one({f'{key}':ObjectId(id)})
        else:
            object = db.find_one({f'{key}':id})
        if(object!=None):
            object = dict(object)
            object['_id'] = str(object['_id'])
            data_object['message'] = object
            return data_object
        data_object_does_not_exist['message'] = 'the object does not exist'
        return data_object_does_not_exist
    except Exception as e:
        error['message'] = str(e)
        return error

def put(key,db,id,data):
    try:
        if(key=='_id'):
            object = db.find_one({f'{key}':ObjectId(id)})
        else:
            object = db.find_one({f'{key}':id})
        if(object!=None):
            data = dict(data)
            print(object)
            if(key=='_id'):
                db.update_one({f'{key}':ObjectId(id)},{'$set':data})
                object = db.find_one({f'{key}':ObjectId(id)})
            else:
                db.update_one({f'{key}':id},{'$set':data})
                object = db.find_one({f'{key}':id})        
            object['_id'] = str(object['_id'])
            data_object['message'] = object 
            return data_object
        data_object_does_not_exist['message'] = 'Object does not exist'
        return data_object_does_not_exist
    except Exception as e:
        error['message'] = str(e)
        return error

def delete(key,db,id):
    try:
        if(key=='_id'):
            object = db.find_one({f'{key}':ObjectId(id)})
        else:
            object = db.find_one({f'{key}':id})
        if(object!=None):
            if(key=='_id'):
                db.delete_one({f'{key}':ObjectId(id)})
            else:
                db.delete_one({f'{key}':id})
            data_object['message'] = 'The Object was deleted'
            return data_object
        data_object_does_not_exist['message'] = 'Object does not exist'
        return data_object_does_not_exist
    except Exception as e:
        error['message'] = str(e)
        return error

# Endpoint para ordenar dependiendo de un atributo las facturas, además
# se recibe un segundo argumento para definir el orden en el que seran ordenadas, es decir
# de forma ascendente o descendente
@facturas.get('/facturas/{sort_key}/{sort_order}/', tags=['Ordenar'])
def ordenar_facturas(sort_key: str, sort_order: str):
    # obtener la colección especificada
    collection = conn.facturas.facturas

    # determinar la dirección de la ordenación
    sort_direction = 1
    if sort_order.lower() == "desc":
        sort_direction = -1

    # buscar todos los documentos en la colección y ordenarlos
    cursor = collection.find({}).sort(sort_key, sort_direction)
    documents = []
    for doc in cursor:
        doc['_id'] = str(doc['_id']) # convertir ObjectId a cadena
        documents.append(doc)
    
    return documents

# Ejemplo de URL para consulta:
# URL_API/facturas/reporte/2022-01-01T00:00:00/2022-01-31T23:59:59/
@facturas.get('/facturas/reporte/{dia_inicio}/{dia_final}/', tags=['Ordenar'])
def generar_reporte(dia_inicio: datetime, dia_final: datetime):
    ventas_totales = 0

    # Consultar las facturas en el intervalo de tiempo especificado
    facturas = conn.facturas.facturas.find({
        "created_date": {
            "$gte": dia_inicio,
            "$lte": dia_final
        }
    })

    #print("facturas:", facturas[0])

    for factura in facturas:
        # Consultar los productos asociados a cada factura
        productos_factura = conn.facturas.productos_facturas.find({
            "factura_id": str(factura["_id"])
        })

        for producto_factura in productos_factura:
            # Consultar el precio del producto en el inventario
            producto = conn.inventario.inventario.find_one({
                "_id": ObjectId(producto_factura["product_id"])
            })

            # Calcular el valor total de la venta de este producto en esta factura
            ventas_producto = int(producto_factura["cantidad"]) * producto["precio"]
            ventas_totales += ventas_producto

    # Crear el objeto de reporte de ventas
    reporte_ventas = {
        "fecha_inicio": dia_inicio,
        "fecha_final": dia_final,
        "ventas_totales": ventas_totales
    }

    return reporte_ventas

@facturas.post('/facturas/', tags=['Facturas'])
def post_facturas(facturas:Facturas):
    return post(facturas,conn.facturas.facturas)

@facturas.get('/facturas/{facturas_id}/', tags=['Facturas'])
def get_facturas(facturas_id:str):
    return get('_id',conn.facturas.facturas,facturas_id)

@facturas.put('/facturas/{facturas_id}/', tags=['Facturas'])
def update_facturas(facturas_id:str, facturas:Facturas):
    return put('_id',conn.facturas.facturas,facturas_id,facturas)
    
@facturas.delete('/facturas/{facturas_id}/', tags=['Facturas'])
def delete_facturas(facturas_id:str):
    return delete('_id',conn.facturas.facturas,facturas_id)

@facturas.post('/producto/', tags=['Productos'])
def asociar_productos(producto:Producto):
    return post(producto, conn.facturas.productos_facturas)
