import type { QuadraticCoefficients, SecantConfig } from "$lib/math";

export interface CoefficientControl {
  key: keyof QuadraticCoefficients;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
}

export const coefficientControls: Array<CoefficientControl> = [
  { key: "a", label: "Coeficiente a", description: "Curvatura de la parábola", min: -5, max: 5, step: 0.25 },
  { key: "b", label: "Coeficiente b", description: "Desplaza la parábola horizontalmente", min: -10, max: 10, step: 0.25 },
  { key: "c", label: "Término independiente c", description: "Corte con el eje Y", min: -12, max: 12, step: 0.25 }
];

export interface SecantControl {
  key: keyof SecantConfig;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
}

export const secantControls: Array<SecantControl> = [
  { key: "x0", label: "x₀", description: "Primer intento", min: -10, max: 10, step: 0.25 },
  { key: "x1", label: "x₁", description: "Segundo intento", min: -10, max: 10, step: 0.25 },
  { key: "tolerance", label: "Tolerancia", description: "Error relativo deseado", min: 1e-7, max: 1e-2, step: 1e-7 },
  { key: "maxIterations", label: "Iteraciones máx.", description: "Tope de refinamientos", min: 1, max: 64, step: 1 }
];

export interface QuadraticPreset {
  label: string;
  coefficients: QuadraticCoefficients;
  secant: SecantConfig;
}

export const presets: Array<QuadraticPreset> = [
  {
    label: "Raíces limpias",
    coefficients: { a: 1, b: -3, c: -4 },
    secant: { x0: -2, x1: 4, tolerance: 1e-6, maxIterations: 18 }
  },
  {
    label: "Complejas",
    coefficients: { a: 2, b: 4, c: 8 },
    secant: { x0: -2, x1: 1, tolerance: 1e-5, maxIterations: 20 }
  },
  {
    label: "Raíz doble",
    coefficients: { a: 1, b: -2, c: 1 },
    secant: { x0: -1, x1: 3, tolerance: 1e-7, maxIterations: 25 }
  }
];

export const generalFormula = "\\displaystyle x = \\frac{-b \\pm \\sqrt{b^{2}-4ac}}{2a}";
export const secantFormula =
  "\\displaystyle x_{n+1} = x_n - f(x_n) \\cdot \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}";

export const detailItems = [
  {
    title: "¿Por qué fórmula general?",
    body:
      "La fórmula cuadrática entrega una solución cerrada basada en el discriminante. Incluso para raíces complejas mantenemos precisión exacta."
  },
  {
    title: "¿Cómo funciona la secante?",
    body:
      "La secante aproxima la derivada con pendientes formadas por dos puntos consecutivos de f(x). No requiere derivadas explícitas y converge rápido si partimos cerca de la raíz."
  },
  {
    title: "Qué observar en la gráfica",
    body:
      "Cada iteración se dibuja sobre f(x) con colores graduados. Selecciona pasos para ver cómo el error cae casi exponencialmente."
  }
];
