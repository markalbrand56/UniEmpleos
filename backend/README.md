# Documentación API

---
## Usuario
### [POST] api/login
Login de usuario.

#### Request Body
``` json
{
    "usuario": "string",
    "contra": "string"
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
Estudiante
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

Empresa
```json
{
  "status": 200,
  "message": "User found",
  "data": {
    "suspendido": false,
    "usuario": {
      "id_empresa": "reclutamiento@sarita.com",
      "nombre": "Sarita SA",
      "detalles": "Venta de insumos refrigerados_NUEVO",
      "correo": "reclutamiento@sarita.com",
      "telefono": "22227314"
    }
  }
}
```
### [POST] api/users/details
Obtener los detalles públicos de un usuario, dado su correo
> **Note**
> Auth required

#### Params
``` json
{
    "correo": "string"
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Student found",
    "data": {
        "student": {
            "correo": "estudiante@prueba.com",
            "nombre": "Estudiante Actualizado",
            "apellido": "Prueba",
            "nacimiento": "2002-02-02T00:00:00Z",
            "telefono": "12345678",
            "carrera": 1,
            "semestre": 4,
            "cv": "",
            "foto": "",
            "universidad": "Universidad Del Valle de Guatemala"
        }
    }
}
```

``` json
{
    "status": 200,
    "message": "Enterprise found",
    "data": {
        "company": {
            "correo": "empresa@prueba.com",
            "nombre": "Empresa de Prueba",
            "foto": "",
            "detalles": "Detalles de Prueba"
        }
    }
}
```
---
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

### [PUT] api/students/update
Actualiza un estudiante
> **Note**
> Auth required

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
    "status": 200,
    "message": "Student updated successfully",
    "data": null
}
```
---
## Mensajes
### [POST] api/messages/send
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

### [POST] api/messages/getLast
Devuelve el último mensaje de un chat dado el usuario
> **Note**
> Auth required

#### Params

``` json
{
    "id_usuario": "string" 
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Message retrieved successfully",
    "data": {
        "message": {
            "postulation_id": 1,
            "user_name": "Empresa INC",
            "user_photo": "",
            "last_message": "Muchas gracias por la información. Estaré a la espera de su correo",
            "last_time": "2023-05-18T02:51:32.554275Z"
        }
    }
}
```
### [POST] api/messages/get
Devuelve los mensajes de un chat dado el emisor y el receptor

> **Note**
> Auth required

#### Params

``` json
{
    "id_emisor": "string",
    "id_receptor": "string"
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Messages retrieved successfully",
    "data": {
        "messages": [
            {
                "id_mensaje": 1,
                "id_emisor": "alb21004@uvg.edu.gt",
                "id_receptor": "hr@empresa.tec",
                "mensaje": "Hola, me gustaria aplicar a la oferta de Desarrollador Web Junior. Me pueden dar mas infromación",
                "tiempo": "2023-05-18T02:38:15.841209Z",
                "emisor_nombre": "Mark",
                "emisor_foto": "foto",
                "receptor_nombre": "Empresa INC",
                "archivo": ""
            },
            {
                "id_mensaje": 2,
                "id_emisor": "hr@empresa.tec",
                "id_receptor": "alb21004@uvg.edu.gt",
                "mensaje": "Hola, gracias por su interes. Le enviaré a su correo más detalles de la propuesta",
                "tiempo": "2023-05-18T02:48:48.644355Z",
                "emisor_nombre": "Mark",
                "emisor_foto": "foto",
                "receptor_nombre": "Empresa INC",
                "receptor_foto": "",
                "archivo": ""
            },
            {
                "id_mensaje": 3,
                "id_emisor": "alb21004@uvg.edu.gt",
                "id_receptor": "hr@empresa.tec",
                "mensaje": "Muchas gracias por la información. Estaré a la espera de su correo",
                "tiempo": "2023-05-18T02:51:32.554275Z",
                "emisor_nombre": "Mark",
                "emisor_foto": "foto",
                "receptor_nombre": "Empresa INC",
                "receptor_foto": "",
                "archivo": ""
            }
        ]
    }
}
```
---
## Empresas
### [POST] api/companies
Crea una compañia

#### Params

``` json
{
	"nombre"        : "string" 
	"detalles"      : "string"
	"foto"   	: "string"
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
    "nombre"        : "string" 
    "detalles"      : "string"
    "correo"    	: "string"
    "telefono"    	: "string" 
    "contra" 	    : "string"
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
---
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
	"id_carreras"    : "[]string"
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

### [PUT] api/offers/
Actualiza una oferta de trabajo
> **Note**
> Auth required

#### Params
``` json
{
    "id_oferta"     : "int" 
    "puesto"	    : "string"
    "descripcion"   : "string"
    "requisitos"    : "string" 
    "salario"	    : "double"
    "id_carreras"   : "[]string"
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Offer updated successfully",
    "data": null
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
                "id_oferta": 52,
                "id_empresa": "reclutamiento@sarita.com",
                "puesto": "puesto dummy",
                "descripcion": "descripcion dummy",
                "requisitos": "requisitos dummy",
                "id_carreras": [
                    1,
                    2,
                    3
                ]
            },
            {
                "id_oferta": 60,
                "id_empresa": "reclutamiento@sarita.com",
                "puesto": "puesto dummy",
                "descripcion": "{\"ops\":[{\"insert\":\"Puesto Dummy\"},{\"attributes\":{\"align\":\"center\"},\"insert\":\"\\n\"}]}",
                "requisitos": "requisitos dummy",
                "id_carreras": null
            }
        ]
    }
}
```

### [POST] api/offers/all
Devuelve todos los detalles de una oferta según el ID. Devuelve además la información de la empresa que lo publicó 
> **Note**
> Auth required

#### Params
``` json
{
    "id_oferta"    : "string" 
}
```

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
### [DELETE] api/offers/
Elimina una oferta de trabajo. También elimina cualquier postulación asociada a la oferta
> **Note**
> Auth required

#### Params
``` json
{
    "id_oferta"    : int
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Offer deleted successfully",
    "data": null
}
```

### [POST] api/offers/applicants
Retorna los estudiantes que se han postulado a una oferta
> **Note**
> Auth required

## Params
``` json
{
	"id_oferta"    	: int
}
```

#### Response
``` json
{
    "status": 200,
    "message": "Applicants returned successfully",
    "data": [
        {
            "apellido": "Albrand",
            "estado": "Enviada",
            "foto": "alb21004_1504802402.jpg",
            "id_estudiante": "alb21004@uvg.edu.gt",
            "nacimiento": "2002-05-06T00:00:00Z",
            "nombre": "Mark",
            "universidad": "Universidad del Valle de Guatemala"
        },
        {
            "apellido": "Contreras Arroyave",
            "estado": "enviada",
            "foto": "",
            "id_estudiante": "contrerasmarce@gmail.com",
            "nacimiento": "2002-10-24T00:00:00Z",
            "nombre": "Marcela",
            "universidad": "Universidad Francisco Marroquín"
        },
        {
            "apellido": "Morales",
            "estado": "En revisión",
            "foto": "",
            "id_estudiante": "mor21146@uvg.edu.gt",
            "nacimiento": "2002-10-24T00:00:00Z",
            "nombre": "Diego",
            "universidad": "UVG"
        }
    ]
}
```

---
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
---
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

### [GET] api/postulations/getFromStudent/
Devuelve las postulaciones de un Estudiante. 
> **Note**
> Auth required

#### Response
```json 

{
    "status": 200,
    "message": "Postulations retrieved successfully",
    "data": {
        "postulations": [
            {
                "id_postulacion": 2,
                "id_oferta": 1,
                "id_empresa": "hr@empresa.tec",
                "puesto": "Desarrollador Web Junior",
                "descripcion": "Desarrollador web junior encargado de Diseñar, desarrollar, dar mantenimiento y soporte a las aplicaciones web",
                "requisitos": "Conocimientos en HTML, CSS, Javascript, PHP, MySQL, React, NodeJS",
                "salario": 5000
            }
        ]
    }
}

```

### [DELETE] api/postulations/?id_postulacion=1
Elimina una postulación. El usuario se obtiene del token. Se pasa el id de la postulación como query param
> **Note**
> Auth required

#### Response
``` json
{
    "status": 200,
    "message": "Postulation deleted successfully",
    "data": null
}
```

---
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
### [GET] api/admins/students
Retorna información de estudiantes para el panel de administradores

> **Note**
> Auth required

#### Response
``` json
"status": 200,
    "message": "Students Retrieved Successfully",
    "data": {
        "studets": [
            {
                "id_estudiante": "alb21004@uvg.edu.gt",
                "foto": "",
                "nombre": "Mark",
                "apellido": "Albrand",
                "nacimiento": "2002-05-06T00:00:00Z",
                "suspendido": false
            }
	  ]
     }
```

### [GET] api/admins/companies
Retorna información de empresas para el panel de administradores

> **Note**
> Auth required

#### Response
``` json
{
    "status": 200,
    "message": "Companies Retrieved Successfully",
    "data": {
        "companies": [
             {
                    "id_empresa": "hr@empresa.tec",
                    "nombre": "Empresa INC",
                    "detalles": "Empresa enfocada a sitios web",
                    "telefono": "58747474",
                    "suspendido": false
            },
        ]
    }
}
```

### [POST] api/admins/suspend
Suspende un usuario

> **Note**
> Auth required

#### Params
``` json
{
    "id_usuario": string,
    "suspender": bool
}
```

#### Response
``` json
{
    "status": 200,
    "message": "User suspended successfully",
    "data": null
}
```
