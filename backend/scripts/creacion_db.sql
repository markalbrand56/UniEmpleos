create table usuario
(
    usuario varchar(10) not null
        primary key,
    contra  varchar(30) not null,
    suspendido boolean not null
);

alter table usuario alter column usuario type varchar(30);
alter table usuario alter column suspendido set default false;

create table empresa
(
    id_empresa varchar(10) not null
        primary key
        references usuario,
    nombre     varchar(50),
    detalles   text,
    correo     varchar(50),
    telefono   varchar(8)
);

alter table empresa alter column id_empresa type varchar(30);

create table administrador
(
    id_admin varchar(10) not null
        primary key
        references usuario,
    nombre   varchar(50),
    apellido varchar(50)
);

alter table administrador alter column id_admin type varchar(30);


create table carrera
(
    id_carrera  serial
        primary key,
    nombre      varchar(50) not null
        unique,
    descripcion text
);


create table estudiante
(
    id_estudiante varchar(10) not null
        primary key
        references usuario,
    dpi           varchar(13) not null
        unique,
    nombre        varchar(50),
    apellido      varchar(50),
    nacimiento    date,
    correo        varchar(50),
    telefono      varchar(8),
    carrera       integer
        references carrera,
    semestre      integer,
    cv            text,
    foto          text
);


create table oferta
(
    id_oferta   serial
        primary key,
    id_empresa  varchar(10)
        references empresa,
    puesto      varchar(50),
    descripcion text,
    requisitos  text
);


create table oferta_carrera
(
    id_oferta  integer not null
        references oferta,
    id_carrera integer not null
        references carrera,
    primary key (id_oferta, id_carrera)
);

alter table oferta_carrera
    owner to postgres;

create table postulacion
(
    id_postulacion serial
        primary key,
    id_oferta      integer
        references oferta,
    id_estudiante  varchar(10)
        references estudiante,
    estado         varchar(10)
);

create table mensaje
(
    id_mensaje     serial
        primary key,
    id_postulacion integer
        references postulacion,
    id_emisor      varchar(10),
    id_receptor    varchar(10),
    mensaje        text,
    tiempo         timestamp
);



