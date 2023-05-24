-- id_oferta, Puesto, nombre de la empresa, area y salario --
create view prev_postulaciones as
select
    o.id_oferta,
    o.puesto,
    e.nombre as nombre_empresa,
    c.nombre as nombre_carrera,
    o.salario
from oferta o
join empresa e
    on o.id_empresa = e.id_empresa
join oferta_carrera oc
    on o.id_oferta = oc.id_oferta
join carrera c
    on oc.id_carrera = c.id_carrera;

select * from prev_postulaciones;