# Laboratorio cuadrático interactivo

Aplicación construida con **SvelteKit + Tailwind + LayerChart** que permite estudiar, en tiempo real, la fórmula cuadrática y el método de la secante. El objetivo es mostrar una UI/UX muy pulida: inputs con validación viva, animaciones suaves, tabla iterativa completa y una gráfica sincronizada con cada aproximación.

## Características principales

- 📐 Resolución exacta mediante la fórmula cuadrática, incluyendo raíces complejas y análisis del discriminante.
- ⚡ Método de la secante en tiempo real con detalle iteración por iteración, errores relativos y estados de convergencia.
- 📊 Visualización interactiva con LayerChart: la curva f(x) se actualiza junto con los puntos generados por la secante.
- 🧠 Microinteracciones en español: tooltips contextualizados, badges de estado, presets y sliders sincronizados.

## Requisitos previos

- [Bun](https://bun.sh/) ≥ 1.0 (Usado por mi originalmente, recomendado por su integración rápida con SvelteKit). También puedes usar npm/pnpm si lo prefieres.
- Node.js 22+ (solo si utilizas npm/pnpm).

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
