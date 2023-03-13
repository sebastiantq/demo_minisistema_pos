def facturasEntity(item) -> dict():
    try:
        return {
           
        }
    except Exception as e:
        return (str(e),item)

def facturassEntity(entity) -> list():
    return [facturasEntity(item) for item in entity]
