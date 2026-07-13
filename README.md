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
