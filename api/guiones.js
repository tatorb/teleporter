// API serverless (Vercel) para la biblioteca de guiones, guardada en Neon (Postgres).
// Rutas (mismo origen que la app):
//   GET    /api/guiones          -> lista [{ id, nombre, marca, semana, piezas, actualizado, creado }]
//   GET    /api/guiones?id=...    -> guión completo { ..., data }
//   POST   /api/guiones          -> crear   (body { nombre?, data })
//   PUT    /api/guiones?id=...    -> actualizar (body { nombre?, data })
//   DELETE /api/guiones?id=...    -> borrar
//
// Variables de entorno en Vercel:
//   DATABASE_URL          -> connection string de Neon (la crea la integración Neon)
//   TELEPROMPTER_TOKEN    -> (opcional) si está seteada, exige el header x-api-key con ese valor

import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

const TOKEN = process.env.TELEPROMPTER_TOKEN || "";

let _ready = null;
function db() {
  if (!process.env.DATABASE_URL) throw new Error("Falta la variable DATABASE_URL (Neon).");
  return neon(process.env.DATABASE_URL);
}
async function ensureTable(sql) {
  if (!_ready) {
    _ready = sql`
      create table if not exists guiones (
        id           text primary key,
        nombre       text not null,
        marca        text,
        semana       text,
        data         jsonb not null,
        creado       timestamptz not null default now(),
        actualizado  timestamptz not null default now()
      )`;
  }
  return _ready;
}

function authorized(req) {
  if (!TOKEN) return true;
  return (req.headers["x-api-key"] || "") === TOKEN;
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body;
}

// Deriva nombre/marca/semana desde el body o el meta del guión
function fields(body) {
  const data = body && body.data !== undefined ? body.data : body;
  const meta = (data && data.meta) || {};
  const nombre = String(
    body.nombre || meta.nombre ||
    (meta.marca ? meta.marca + (meta.semana != null ? " · Semana " + meta.semana : "") : "") ||
    "Guión sin nombre"
  ).slice(0, 120);
  const marca = meta.marca != null ? String(meta.marca).slice(0, 80) : null;
  const semana = meta.semana != null ? String(meta.semana).slice(0, 40) : null;
  return { data, nombre, marca, semana };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-api-key");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!authorized(req)) return res.status(401).json({ error: "No autorizado" });

  try {
    const sql = db();
    await ensureTable(sql);
    const id = req.query && req.query.id;

    if (req.method === "GET") {
      if (id) {
        const rows = await sql`
          select id, nombre, marca, semana, data, creado, actualizado
          from guiones where id = ${id}`;
        if (!rows.length) return res.status(404).json({ error: "No existe" });
        return res.status(200).json(rows[0]);
      }
      const rows = await sql`
        select id, nombre, marca, semana, creado, actualizado,
               jsonb_array_length(coalesce(data->'piezas', '[]'::jsonb)) as piezas
        from guiones
        order by actualizado desc`;
      return res.status(200).json(rows);
    }

    if (req.method === "POST" || req.method === "PUT") {
      const body = parseBody(req);
      const { data, nombre, marca, semana } = fields(body);
      if (!data || !Array.isArray(data.piezas) || !data.piezas.length) {
        return res.status(400).json({ error: 'El guión no tiene "piezas".' });
      }
      const useId = id || body.id || randomUUID();
      const json = JSON.stringify(data);
      const rows = await sql`
        insert into guiones (id, nombre, marca, semana, data)
        values (${useId}, ${nombre}, ${marca}, ${semana}, ${json}::jsonb)
        on conflict (id) do update set
          nombre = excluded.nombre, marca = excluded.marca,
          semana = excluded.semana, data = excluded.data, actualizado = now()
        returning id, nombre, marca, semana, creado, actualizado`;
      return res.status(200).json(rows[0]);
    }

    if (req.method === "DELETE") {
      if (!id) return res.status(400).json({ error: "Falta id" });
      await sql`delete from guiones where id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Método no permitido" });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
