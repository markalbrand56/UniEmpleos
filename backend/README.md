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
        "usuario": {
            "id_estudiante": "mor21146@uvg.edu.gt",
            "dpi": "2805589930122",
            "nombre": "Diego",
            "apellido": "Morales",
            "nacimiento": "2004-01-10T00:00:00Z",
            "correo": "mor21246@uvg.edu.gt",
            "telefono": "43123123",
            "carrera": 1,
            "semestre": 5,
            "cv": "cv",
            "foto": "foto",
            "universidad": ""
        }
    }
}

```
## Estudiante
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
	"contra"	: "string"
	"universidad"   : "string"
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

## Mensajes
### [POST] api/messages
Crea un mensaje
> **Note**
> Auth required

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

## Empresas
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

### [PUT] api/companies/update
Actualiza una compañia
> **Note**
> Auth required

#### Params
``` json
{
    "nombre"        : "ejemplo" 
    "detalles"      : "detalles"
    "correo"    	: "correo@gmail.com"
    "telefono"    	: "12345678" 
    "contra" 	    : "contrasena"
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Company updated successfully",
    "data": null
}
```

## Ofertas de trabajo
### [POST] api/offers
Crea una oferta de trabajo
> **Note**
> Auth required

#### Params

``` json
{
	"id_empresa"    : "string" 
	"puesto"	: "string"
	"descripcion"   : "string"
	"requisitos"    : "string" 
	"salario"	: "double"
	"id_ofertas"    : "[]string"
}
```

#### Response
``` json
{
	"Status":  200,
	"Message": "Offer created successfully",
	"Data":    null
}
```

### [GET] api/postulations/previews
Devuelve la información para las preview de las ofertas disponibles
> **Note**
> Auth required

#### Response
``` json
{
    "status": 200,
    "message": "Postulations retrieved successfully",
    "data": {
        "postulations": [
            {
                "id_oferta": 3,
                "nombre_carreras": "Ingenieria en Sistemas",
                "nombre_empresa": "Valve Corporation",
                "puesto": "Desarrollador de Videojuegos",
                "salario": 15000
            },
            {
                "id_oferta": 4,
                "nombre_carreras": "Ingenieria en Sistemas",
                "nombre_empresa": "Simán",
                "puesto": "DataBase Administrator",
                "salario": 10000
            },
            {
                "id_oferta": 1,
                "nombre_carreras": "Ingenieria en Sistemas, Ingenieria en mecánica industrial",
                "nombre_empresa": "Empresa INC",
                "puesto": "Desarrollador Web Junior",
                "salario": 5000
            },
            {
                "id_oferta": 2,
                "nombre_carreras": "Ingenieria en Sistemas",
                "nombre_empresa": "Empresa INC",
                "puesto": "Desarrollador Full Stack",
                "salario": 10000
            }
        ]
    }
}
```

### [POST] api/offers/company
Devuelve las ofertas de trabajo publicadas por una compañia
> **Note**
> Auth required

#### Params
``` json
{
    "id_empresa"    : "string" 
}
```

#### Response 
``` json
{
    "status": 200,
    "message": "Offers retrieved successfully",
    "data": {
        "offers": [
            {
                "id_oferta": 1,
                "id_empresa": "hr@empresa.tec",
                "puesto": "Desarrollador Web Junior",
                "descripcion": "Desarrollador web junior encargado de Diseñar, desarrollar, dar mantenimiento y soporte a las aplicaciones web",
                "requisitos": "Conocimientos en HTML, CSS, Javascript, PHP, MySQL, React, NodeJS",
                "salario": 5000
            },
            {
                "id_oferta": 2,
                "id_empresa": "hr@empresa.tec",
                "puesto": "Desarrollador Full Stack",
                "descripcion": "Desarrollador web full stack encargado de Diseñar, desarrollar, dar mantenimiento y soporte a las aplicaciones web",
                "requisitos": "Conocimientos en HTML, CSS, Javascript, PHP, MySQL, React, NodeJS, Java, C#",
                "salario": 10000
            }
        ]
    }
}
```

### [POST] api/offers/all
Devuelve todas las ofertas de trabajo, y el detalle de la compañia que la publicó
> **Note**
> Auth required

#### Response
``` json
{
    "status": 200,
    "message": "Offer retrieved successfully",
    "data": {
        "company": {
            "id_empresa": "hr@empresa.tec",
            "nombre": "Empresa INC",
            "detalles": "Empresa enfocada a sitios web",
            "correo": "hr@empresa.tec",
            "telefono": "58747474"
        },
        "offer": {
            "id_oferta": 1,
            "id_empresa": "hr@empresa.tec",
            "puesto": "Desarrollador Web Junior",
            "descripcion": "Desarrollador web junior encargado de Diseñar, desarrollar, dar mantenimiento y soporte a las aplicaciones web",
            "requisitos": "Conocimientos en HTML, CSS, Javascript, PHP, MySQL, React, NodeJS",
            "salario": 5000
        }
    }
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

## Carreras
### [GET] api/careers
Devuelve todas las carreras


#### Response
``` json
{
    "status": 200,
    "message": "Carrers retrieved successfully",
    "data": {
        "carrers": [
            {
                "id_carrera": 1,
                "nombre": "Ingenieria en Sistemas",
                "descripcion": ""
            },
            {
                "id_carrera": 3,
                "nombre": "Ingenieria en ciencia de datos",
                "descripcion": ""
            },
            {
                "id_carrera": 2,
                "nombre": "Ingenieria en mecánica industrial",
                "descripcion": ""
            },
            {
                "id_carrera": 0,
                "nombre": "Ingeniería Mecatrónica",
                "descripcion": "Ingeniería Mecatrónica"
            }
        ]
    }
}
```

## Postulaciones
### [POST] api/postulation
Crea una postulacíón de trabajo, cuando un estudiante se postula a una oferta
> **Note**
> Auth required

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

## Administradores
### [POST] api/admins
Crea un administrador

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

