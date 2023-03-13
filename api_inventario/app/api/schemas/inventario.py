def inventarioEntity(item) -> dict():
    try:
        data = {}
        data["id"] = str(item["_id"])
        for i in list(item):
            if(str(i)!="_id"):
                data[str(i)] = (item[str(i)])
        return data
    except Exception as e:
        return (str(e),item)

def inventariosEntity(entity) -> list():
    return [inventarioEntity(item) for item in entity]
