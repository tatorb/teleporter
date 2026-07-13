# Teleprompter para Reels & Entrevistas

Teleprompter que corre en el navegador, pensado para grabar reels y entrevistas
en una sola toma. Es **un solo archivo** (`index.html`), sin dependencias ni
instalación: se abre con doble clic en cualquier navegador y funciona offline.

## Cómo usarlo

1. Abrí `index.html` en el navegador (Chrome, Safari, Firefox, Edge).
2. Tocá **Play** (o barra espaciadora) — arranca con cuenta regresiva 3·2·1.
3. Ajustá velocidad, tamaño y demás desde la barra superior.
4. Para tu guión: abrí **☰ Guión**, pegá tu JSON y tocá **Cargar guión**.

El guión y los ajustes se guardan solos en tu navegador (localStorage).

## Funciones

- **Velocidad** de scroll ajustable (px/seg), en vivo.
- **Fondo negro o blanco** (tecla `B`).
- **Tipografía serif** (Georgia) grande y legible; tamaño ajustable.
- **Ancho de columna** e **interlineado** regulables.
- **Formatos por tipo de bloque**: gancho, título, entrevistador, entrevistado,
  narración, dirección de escena, B-roll, CTA y pausa — cada uno con su estilo.
- **Espejo horizontal/vertical** para teleprompter físico con cristal (tecla `M`).
- **Línea de lectura** y **modo foco** (viñeta) para fijar la mirada.
- **Cuenta regresiva** antes de empezar.
- **Barra de progreso** del guión.
- **Barra que se auto-oculta** al reproducir (para que la cámara solo vea el texto).
- **Pantalla completa** (tecla `F`) y **saltar entre bloques** (`←` / `→`).
- **Importar/exportar** guiones `.json`.

## Atajos de teclado

| Tecla | Acción |
|-------|--------|
| Espacio | Play / Pausa |
| ↑ / ↓ | Velocidad |
| + / − | Tamaño de texto |
| ← / → | Saltar bloque |
| R | Reiniciar |
| B | Fondo negro / blanco |
| M | Espejo horizontal |
| L | Línea de lectura |
| F | Pantalla completa |
| G | Panel de guión |
| Home | Ir al inicio |
| Esc | Cerrar panel |

## Estructura del guión (JSON)

Esta es la estructura que entiende la app. Copiala y pedile a Claude:
*"adaptá este guión a esta estructura JSON"*.

```json
{
  "meta": {
    "titulo": "Nombre del guión",
    "autor": "Studio MRB",
    "duracionEstimada": "60s",
    "notas": "texto libre"
  },
  "config": {
    "velocidad": 40,
    "tamanoTexto": 46,
    "tema": "negro",
    "espejo": false
  },
  "bloques": [
    { "tipo": "gancho", "texto": "Frase de apertura (primeros 3 segundos)" },
    { "tipo": "titulo", "texto": "Bloque 1 · Presentación" },
    { "tipo": "direccion", "texto": "Mirá a cámara, sonreí, pausa de 1 seg" },
    { "tipo": "entrevistador", "nombre": "Ana", "texto": "¿Cómo empezó todo?" },
    { "tipo": "entrevistado", "nombre": "Martín", "texto": "Empezó en el living..." },
    { "tipo": "broll", "texto": "plano detalle de las manos" },
    { "tipo": "narracion", "texto": "Texto a cámara o voz en off" },
    { "tipo": "pausa", "texto": "" },
    { "tipo": "cta", "texto": "Seguime para la parte 2 👇" }
  ]
}
```

### Campos

**Raíz**

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `meta` | no | Datos del guión |
| `config` | no | Ajustes iniciales |
| `bloques` | **sí** | Lista ordenada de bloques |

**`config`**

| Campo | Valores |
|-------|---------|
| `velocidad` | px/seg, 5–200 |
| `tamanoTexto` | px, 24–120 |
| `tema` | `"negro"` \| `"blanco"` |
| `espejo` | `true` \| `false` |

**Tipos de bloque (`bloques[].tipo`)**

| Tipo | Uso | Se lee en cámara |
|------|-----|------------------|
| `gancho` | Frase de apertura, primeros 3 seg | sí |
| `titulo` | Separador / nombre de sección | referencia |
| `entrevistador` | Pregunta (usa `nombre`) | sí |
| `entrevistado` | Respuesta (usa `nombre`) | sí |
| `narracion` | Texto a cámara / voz en off | sí |
| `direccion` | Indicación de escena ("mirá a cámara") | **no**, es una nota |
| `broll` | Nota de plano de apoyo | **no**, es una nota |
| `cta` | Llamada a la acción | sí |
| `pausa` | Silencio / respiro | referencia |

**Campos de cada bloque**

| Campo | Descripción |
|-------|-------------|
| `texto` | Contenido del bloque |
| `nombre` | Quién habla (para `entrevistador` / `entrevistado`) |

## Prompt sugerido para Claude

> Adaptá el siguiente guión a esta estructura JSON de teleprompter.
> Marcá el gancho inicial, separá preguntas (`entrevistador`) y respuestas
> (`entrevistado`), agregá bloques `direccion` con indicaciones de cámara,
> notas `broll` donde convenga, y cerrá con un `cta`. Devolvé solo el JSON.
>
> [pegás tu guión acá]
