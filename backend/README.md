# Documentación API

## Usuario

### [POST] api/login
Login de usuario.

#### Request Body
``` json
{
    "usuario": "ejemplo",
    "contra": "ejemploContraseña"
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Login successful",
    "data": {
        "token": "abcdefghijklmnopqrstuvwxyz"
    }
}
```

### [POST] api/register
Registrar usuario.

#### Request Body
``` json
{
    "usuario": "ejemplo",
    "contra": "ejemploContraseña"
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Usuario created successfully",
    "data": null
}
```

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