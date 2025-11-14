# Laboratorio cuadrático interactivo

Aplicación construida con **SvelteKit + Tailwind + LayerChart** que permite estudiar, en tiempo real, la fórmula cuadrática y el método de la secante. El objetivo es mostrar una UI/UX muy pulida: inputs con validación viva, animaciones suaves, tabla iterativa completa y una gráfica sincronizada con cada aproximación.

## Características principales

- 📐 Resolución exacta mediante la fórmula cuadrática, incluyendo raíces complejas y análisis del discriminante.
- ⚡ Método de la secante en tiempo real con detalle iteración por iteración, errores relativos y estados de convergencia.
- 📊 Visualización interactiva con LayerChart: la curva f(x) se actualiza junto con los puntos generados por la secante.
- 🧠 Microinteracciones en español: tooltips contextualizados, badges de estado, presets y sliders sincronizados.

## Requisitos previos

- [Bun](https://bun.sh/) ≥ 1.0 (recomendado por su integración rápida con SvelteKit). También puedes usar npm/pnpm si lo prefieres.
- Node.js 18+ (solo si utilizas npm/pnpm).

## Instalación

```bash
bun install
```

> ¿Prefieres npm? Ejecuta `npm install` y los scripts funcionarán igual.

## Scripts útiles

```bash
# Desarrollo con recarga en caliente
bun run dev

# Revisión estática y de tipos
bun run check

# Build de producción
bun run build

# Vista previa local del build
bun run preview
```

## Estructura relevante

- `src/routes/+page.svelte`: página principal con toda la UI interactiva.
- `src/lib/math.ts`: utilidades numéricas (fórmula cuadrática y secante).
- `src/lib/components/MathBlock.svelte`: wrapper ligero para renderizar fórmulas KaTeX.
- `src/app.css`: configuración de Tailwind 4 con los temas y colores del dashboard.

## Próximos pasos sugeridos

- Ajustar estilos o paletas desde `app.css` para adaptar la UI a tu identidad visual.
- Añadir persistencia (por ejemplo, guardando presets personalizados en `localStorage`).
- Extender el laboratorio con otros métodos (Newton-Raphson, bisección) reutilizando la misma arquitectura.

¡Disfruta explorando las raíces cuadráticas con una experiencia digna de una app premium! 
