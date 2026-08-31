# Teleprompter · Studio MRB

Teleprompter que corre en el navegador, pensado para grabar los reels y
carruseles de la semana en una sola toma. Es **un solo archivo** (`index.html`),
sin dependencias ni instalación: se abre con doble clic en cualquier navegador y
funciona offline.

El diseño sigue el **brand design de Studio MRB**: sistema monocromático (negro,
blanco y rampa slate, **sin colores de acento**), tipografía **Urbanist**, y la
jerarquía construida con peso, escala, mayúsculas y tracking en vez de color.

## Cómo usarlo

1. Abrí `index.html` en el navegador.
2. **Guión** (`{ }` o tecla `G`): elegí un guión de la **biblioteca** o pegá el JSON de la semana.
3. **Índice** (`≡` o tecla `I`): saltá entre piezas y mirá la distribución de contenido.
4. **Reproducir** (barra espaciadora): arranca con cuenta regresiva 3·2·1.

El guión y los ajustes se guardan solos en el navegador (localStorage).

## Biblioteca de guiones (base de datos en la nube)

La app guarda los guiones en una **base de datos Neon (Postgres) sobre Vercel**.
Eso te da una **biblioteca compartida**: guardás un guión con su nombre y queda
disponible **desde cualquier dispositivo** (compu, tablet), sin mover archivos.

> **Importante — usá la URL de Vercel.** La biblioteca vive en tu app de Vercel
> (ej. `https://teleporter-kappa.vercel.app`). Si abrís la app desde **GitHub Pages**
> (`*.github.io`) o un archivo local, esa dirección **no tiene base de datos** y la
> biblioteca no carga. Solución: abrí la app desde la URL de Vercel (guardala como
> bookmark en la compu y la tablet), o pegá tu URL de Vercel en *Editar / pegar JSON →
> Servidor de la biblioteca* (o abrí con `?api=https://tu-app.vercel.app`).

En el panel **Guión** → **☁️ Biblioteca de guiones**:

- **Buscar** por nombre, marca, semana o fecha.
- Tocás un guión de la lista para **cargarlo** al teleprompter.
- **☁️ Guardar en la nube** guarda el guión actual con el nombre que pongas
  (si el nombre ya existe, lo actualiza; si no, crea uno nuevo). La fecha se
  registra sola.
- **🗑** borra un guión de la biblioteca.

Debajo, en *✍️ Editar / pegar JSON · importar · descargar*, tenés el editor para
pegar/editar el JSON, **Importar** un `.json` del dispositivo y **Descargar** el
actual como respaldo. El flujo normal: pegás lo que te da Claude → *Cargar al
teleprompter* → *☁️ Guardar en la nube*.

### Desplegar en Vercel + Neon (una vez)

La app es estática (`index.html`) + una función serverless (`api/guiones.js`)
que habla con Neon. Para ponerla online:

1. En **Vercel**, *Add New → Project* e importá el repo `tatorb/teleporter`
   (framework preset: **Other**, sin build).
2. Agregá la **integración de Neon** (Vercel → Integrations → Neon) o creá una
   base en Neon y pegá su connection string. Debe quedar como variable de entorno
   **`DATABASE_URL`** en el proyecto de Vercel.
3. *(Opcional)* Para que no cualquiera con el link escriba, seteá la variable
   **`TELEPROMPTER_TOKEN`** con una clave. Después la ponés una vez en la app
   (*Editar / pegar JSON → Clave de acceso*).
4. **Deploy**. Listo: abrís la URL de Vercel en la compu y la tablet, y las dos
   ven la misma biblioteca.

La tabla `guiones` **se crea sola** en el primer guardado (ver `db/schema.sql`
por referencia). La API:

| Método | Ruta | Acción |
|--------|------|--------|
| `GET` | `/api/guiones` | lista (id, nombre, marca, semana, piezas, fecha) |
| `GET` | `/api/guiones?id=…` | trae un guión completo |
| `POST` | `/api/guiones` | crea (`{ nombre, data }`) |
| `PUT` | `/api/guiones?id=…` | actualiza |
| `DELETE` | `/api/guiones?id=…` | borra |

> Si abrís `index.html` como archivo local (sin desplegar), la biblioteca en la
> nube no está disponible y la app te lo avisa; podés seguir usando
> Importar/Pegar/Descargar como respaldo offline.

## Funciones

- **Velocidad** de scroll y **tamaño** de texto ajustables en vivo.
- **Fondo claro/oscuro** (checkbox *Oscuro*, tecla `B`) — el oscuro es negro puro,
  ideal para el cristal de un teleprompter físico.
- **Espejo** horizontal para rig con cristal (checkbox *Espejo*, tecla `M`).
- **Tipografía Urbanist** (marca) o **Serif** conmutable (`Aa`, tecla `T`).
- **Formatos por rol de bloque**: hook, problema, solución, prueba social, CTA,
  contenido, dirección… El **CTA** se muestra como la tarjeta invertida de marca.
- **Índice de piezas** con estado (grabada / pendiente / en revisión) y
  **distribución de contenido** real vs. objetivo por categoría.
- **Línea de lectura**, **modo foco**, **cuenta regresiva**, **barra de progreso**,
  **pantalla completa** y **barra que se auto-oculta** al grabar.
- **Edición en vivo** (botón **✎ Editar**, tecla `E`): para cambios de último
  minuto sin abrir el JSON. Achica el texto, tocás cualquier bloque o título y
  lo corregís con el teclado. **✓ Listo** aplica los cambios al guión que está
  corriendo; **☁️ Guardar** además los guarda en la nube.
- **Editor JSON con números de línea**: el cuadro de *Editar / pegar JSON* muestra
  la numeración a un costado (sincronizada con el scroll) y, si el JSON tiene un
  error, el mensaje indica en qué **línea y columna** está.
- **Parser tolerante**: acepta comentarios `//` y comas finales, así pegás
  directo lo que te genera Claude.

## Atajos de teclado

| Tecla | Acción | Tecla | Acción |
|-------|--------|-------|--------|
| Espacio | Play / Pausa | `B` | Fondo claro/oscuro |
| ↑ / ↓ | Velocidad | `M` | Espejo |
| + / − | Tamaño | `L` | Línea de lectura |
| ← / → | Saltar bloque | `T` | Tipografía |
| `I` | Índice | `F` | Pantalla completa |
| `R` | Reiniciar | `G` | Panel de guión |
| `E` | Editar en vivo | Esc | Salir de edición / cerrar |
| Home | Ir al inicio | | |

## Estructura del guión (JSON)

Esta es la estructura que entiende la app. Dentro del panel **Guión → Estructura**
está documentada, y el botón **Copiar plantilla** la deja lista para pasarle a
Claude. El parser acepta comentarios `//`.

```jsonc
{
  "meta": {
    "influencer": "Federico Colrat",
    "handle": "Accounting Advisor",
    "marca": "FINANCERS",
    "semana": 1,
    "registro": "voseo_ar",
    "distribucion_objetivo": { "problema": 50, "solucion": 30, "otros": 20, "producto": "condimento" }
  },
  "config": { "velocidad": 40, "tamanoTexto": 44, "oscuro": false },
  "piezas": [
    {
      "id": 3,
      "dia": 2,
      "titulo": "Multa \"no me avisaron\"",
      "categoria": "problema",          // problema | solucion | producto | otros
      "familia": "rescate",             // rescate | internacionalizacion | capital | nucleo
      "formato": "reel",                // reel | carrusel
      "tipo_video": "hablando a cámara",// hablando a cámara | entrevista | selfie | escritorio
      "estado": "grabada",              // grabada | pendiente | en_revision
      "cta": {
        "tipo": "palabra_clave",        // palabra_clave | seguir | guardar
        "palabra": "MULTA",
        "recurso": "chequeo de obligaciones anuales"
      },
      "bloques": [
        { "rol": "hook",          "label": "Hook (0-3s)",   "slide": null, "pregunta_guia": null, "texto": "..." },
        { "rol": "problema",      "label": "Problema",      "slide": null, "pregunta_guia": null, "texto": "..." },
        { "rol": "solucion",      "label": "Solución",      "slide": null, "pregunta_guia": null, "texto": "..." },
        { "rol": "prueba_social", "label": "Prueba social", "slide": null, "pregunta_guia": null, "texto": "..." },
        { "rol": "cta",           "label": "CTA",           "slide": null, "pregunta_guia": null, "texto": "..." }
      ]
    }
  ]
}
```

### Campos

**Raíz**

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `meta` | no | Datos de la semana |
| `config` | no | `velocidad`, `tamanoTexto`, `oscuro` |
| `piezas` | **sí** | Lista de piezas |

**`piezas[]`**

| Campo | Valores |
|-------|---------|
| `id` / `dia` | identificador y día |
| `titulo` | nombre de la pieza |
| `categoria` | `problema` · `solucion` · `producto` · `otros` |
| `familia` | `rescate` · `internacionalizacion` · `capital` · `nucleo` |
| `formato` | `reel` · `carrusel` |
| `tipo_video` | `hablando a cámara` · `entrevista` · `selfie` · `escritorio` |
| `estado` | `grabada` · `pendiente` · `en_revision` |
| `cta` | `{ tipo, palabra, recurso }` |
| `bloques` | contenido de la pieza |

**`bloques[]`**

| Campo | Descripción |
|-------|-------------|
| `rol` | `hook` · `problema` · `solucion` · `prueba_social` · `cta` · `contenido` · `direccion`… (define el estilo) |
| `label` | rótulo mostrado (si falta, se deriva del `rol`) |
| `texto` | lo que se lee en cámara |
| `slide` | número de slide (para carruseles) |
| `pregunta_guia` | pregunta guía de entrevista — se muestra atenuada, no forma parte del texto |

**`cta`**

| Campo | Valores |
|-------|---------|
| `tipo` | `palabra_clave` · `seguir` · `guardar` |
| `palabra` | palabra clave del comentario |
| `recurso` | lead magnet que entregás |

## Prompt sugerido para Claude

> Adaptá los guiones de esta semana a la estructura JSON del teleprompter Studio MRB.
> Cada guión es una `pieza` con su `categoria`, `familia`, `formato`, `tipo_video`,
> `estado` y `cta`. Separá el contenido en `bloques` con `rol` (hook, problema,
> solucion, prueba_social, cta…). Respetá el registro `voseo_ar`. Mantené la
> `distribucion_objetivo` de la semana. Devolvé solo el JSON.
>
> [pegás tus guiones acá]
