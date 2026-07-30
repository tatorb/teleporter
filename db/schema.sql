-- Esquema de la biblioteca de guiones (Neon / Postgres).
-- No hace falta correrlo a mano: la API lo crea sola en el primer uso.
-- Está acá por referencia y por si querés inspeccionar la base en Neon.

create table if not exists guiones (
  id           text primary key,
  nombre       text not null,
  marca        text,
  semana       text,
  data         jsonb not null,
  creado       timestamptz not null default now(),
  actualizado  timestamptz not null default now()
);

-- Búsquedas por fecha de actualización (la lista viene ordenada por esto).
create index if not exists guiones_actualizado_idx on guiones (actualizado desc);
