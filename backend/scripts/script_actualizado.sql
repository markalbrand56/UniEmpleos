create table usuario
(
    usuario varchar(50) not null
        primary key,
    contra  varchar(150) not null,
    suspendido boolean not null
);

alter table usuario alter column suspendido set default false;

-- usuario no cambia --

create table empresa
(
    id_empresa varchar(50) not null
        primary key
        references usuario(usuario) on delete cascade on update cascade,
    nombre     varchar(50),
    detalles   text,
    correo     varchar(50),
    telefono   varchar(8)
);


-- revisado --

create table administrador
(
    id_admin varchar(50) not null
        primary key
        references usuario(usuario) on delete cascade on update cascade,
    nombre   varchar(50),
    apellido varchar(50)
);

-- revisado --

create table carrera
(
    id_carrera  serial
        primary key,
    nombre      varchar(50) not null
        unique,
    descripcion text
);

-- revisado --


create table estudiante
(
    id_estudiante varchar(50) not null
        primary key
        references usuario(usuario) on delete cascade on update cascade,
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
        references empresa on delete cascade on update cascade,
    puesto      varchar(50),
    descripcion text,
    requisitos  text
);


create table oferta_carrera
(
    id_oferta  integer not null
        references oferta on delete cascade on update cascade,
    id_carrera integer not null
        references carrera on delete cascade on update cascade,
    primary key (id_oferta, id_carrera)
);

alter table oferta_carrera
    owner to postgres;

create table postulacion
(
    id_postulacion serial
        primary key,
    id_oferta      integer
        references oferta on delete cascade on update cascade,
    id_estudiante  varchar(10)
        references estudiante on delete cascade on update cascade,
    estado         varchar(10)
);

create table mensaje
(
    id_mensaje     serial
        primary key,
    id_postulacion integer
        references postulacion on delete cascade on update cascade,
    id_emisor      varchar(10),
    id_receptor    varchar(10),
    mensaje        text,
    tiempo         timestamp
);

