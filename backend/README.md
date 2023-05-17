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

#### Params
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

### [GET] api/users
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

### [POST] api/students
Crea un estudiante

#### Params

``` json
{
	"dpi"	        : "string" 
	"nombre"        : "string" 
	"apellido"      : "string"
	"nacimiento"    : "string" 
	"correo"        : "string" 
	"telefono"      : "string" 
	"carrera"       : "int"    
	"semestre"      : "int"    
	"cv"            : "string" 
	"foto"          : "string" 
}
```

#### Response
``` json
{
	"Status":  200,
	"Message": "Student created successfully",
	"Data":    "nil"
}
```

### [POST] api/messages
Crea un mensaje

#### Params

``` json
{
	"id_postulacion"   : "int" 
	"id_emisor"        : "string" 
	"id_receptor"      : "string"
	"mensaje"    	   : "string" 
}
```

#### Response
``` json
{
	"Status":  200,
	"Message": "Message sent successfully",
	"Data":    "nil"
}
```

### [POST] api/companies
Crea una compañia

#### Params

``` json
{
	"nombre"        : "string" 
	"detalles"      : "string"
	"correo"    	: "string"
	"telefono"    	: "string" 
	"contra" 	: "string"
}
```

#### Response
``` json
{
	"Status":  200,
	"Message": "Company created successfully",
	"Data":    "nil"
}
```

### [POST] api/offers
Crea una oferta de trabajo

#### Params

``` json
{
	"id_empresa"    : "string" 
	"puesto"	: "string"
	"descripcion"   : "string"
	"requisitos"    : "string" 
}
```

#### Response
``` json
{
	"Status":  200,
	"Message": "Offer created successfully",
	"Data":    "nil"
}
```

### [POST] api/carrer
Crea una carrera

#### Params

``` json
{
	"nombre"    	: "string" 
	"descripcion"	: "string"
}
```

#### Response
``` json
{
	"Status":  "200",
	"Message": "Carrera created successfully",
	"Data": "nil"
}
```

### [POST] api/postulation
Crea una postulacíon

#### Params

``` json
{
	"id_oferta"    	: "int" 
	"id_estudiante"	: "string"
	"estado" 	: "string"
}
```

#### Response
``` json
{
	"Status":  "200",
	"Message": "Postulation created successfully",
	"Data": "nil"
}
```

### [POST] api/admins
Crea una postulacíon

#### Params

``` json
{
	"id_administrador"    	: "string" 
	"nombre"		: "string"
	"apellido" 		: "string"
}
```

#### Response
``` json
{
	"Status":  "200",
	"Message": "Admin Created Successfully",
	"Data": "nil"
}
```

