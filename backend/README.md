# Documentación API

## Usuario

### [POST] api/login
Login de usuario.

### [GET] api/users/
Obtener el usuario actual.
> **Note**
> Auth required

#### Response
``` json
{
    "status": 200,
    "message": "User found",
    "data": {
        "suspendido": false,
        "usuario": "pruebaAPIEncriptado"
    }
}
```