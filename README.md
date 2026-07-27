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
2. **Guión** (`{ }` o tecla `G`): pegá el JSON de la semana → **Cargar guión**.
3. **Índice** (`≡` o tecla `I`): saltá entre piezas y mirá la distribución de contenido.
4. **Reproducir** (barra espaciadora): arranca con cuenta regresiva 3·2·1.

El guión y los ajustes se guardan solos en el navegador (localStorage).

## Cargar el guión desde internet (recomendado)

Para no depender de guardar y abrir archivos a mano: en el panel **Guión** hay
una sección **🌐 Guión online (URL)**. Pegás **una sola vez** la URL de un JSON
publicado en internet y la app lo trae sola cada vez que abrís la página.

1. Publicás el guión en algún lugar que devuelva el JSON por URL (ver opciones abajo).
2. En la app pegás esa URL en **🌐 Guión online (URL)** → **Cargar**.
3. Dejás tildado *"Auto-cargar esta URL cada vez que abro la página"*.

A partir de ahí: editás el guión en internet desde la compu y **la tablet trae
la última versión sola** al abrir. Si estás sin conexión, usa la última copia
que quedó guardada. El botón **🔄** fuerza traer la versión más nueva.

**Acceso directo (bookmark):** podés abrir la app con la URL ya incluida usando
`index.html?src=TU_URL`. Guardás ese enlace en la pantalla de inicio de la
tablet y con un toque abre el teleprompter con el guión cargado.

### Dónde publicar el JSON

El navegador exige que el hosting permita **CORS**. Funcionan bien:

| Opción | Cómo se edita | URL a pegar |
|--------|---------------|-------------|
| **GitHub** (este repo) | Editás `guiones/actual.json` en github.com o me lo pedís a mí | `https://raw.githubusercontent.com/tatorb/teleporter/main/guiones/actual.json` |
| **Gist** | gist.github.com, editás en el navegador | el botón **Raw** del Gist |
| **npoint.io** | editor JSON online, gratis | la URL de API que te da |
| **Dropbox** | subís el archivo | el link de compartir (la app lo convierte a directo) |

> Google Drive **no** sirve para esto: bloquea el acceso directo (CORS) desde el navegador.

La app entiende links "de compartir" de GitHub y Dropbox y los convierte al link
directo sola.

### Que también la app viva en internet (GitHub Pages)

Si querés abrir **la app misma** desde una URL (sin archivo local), activá GitHub
Pages en el repo: *Settings → Pages → Deploy from a branch → `main` / root*.
Queda publicada en `https://tatorb.github.io/teleporter/` y, como el guión está
en el mismo sitio (`guiones/actual.json`), **la carga sola sin configurar nada**.
Editás `guiones/actual.json` en github.com y listo.

## Guardar y abrir archivos (alternativa sin internet)

En el panel **Guión** tenés dos botones:

- **💾 Guardar .json** — descarga el guión como archivo, con el nombre armado
  automáticamente desde la marca y la semana (ej. `financers-semana-1.json`).
  Guarda exactamente lo que editaste (incluidos los comentarios `//`).
- **📂 Abrir .json** — abre un archivo `.json` desde el dispositivo.

Flujo típico:

1. En la **computadora**, cargás/editás el guión y tocás **💾 Guardar .json**.
2. Pasás ese archivo a la **tablet** (Google Drive, iCloud, AirDrop, etc.).
3. En la tablet abrís esta misma página (`index.html`) y tocás **📂 Abrir .json**.

En iPad, *Abrir .json* usa la app **Archivos**, así que podés levantar el guión
directo desde Drive o iCloud. El último guión abierto queda guardado en el
navegador de cada dispositivo.

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
| Home | Ir al inicio | Esc | Cerrar paneles |

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
