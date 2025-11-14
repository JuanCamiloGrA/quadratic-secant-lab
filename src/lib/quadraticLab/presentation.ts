import type {
  QuadraticCoefficients,
  QuadraticSolution,
  SecantConfig,
  SecantIteration,
  SecantResult
} from "$lib/math";
import { formatNumber, formatScientific, sanitizeNumber } from "$lib/quadraticLab/formatting";

export type Tone = "success" | "warning" | "danger" | "muted";

export function normalizeSecantConfig(config: SecantConfig): SecantConfig {
  const sanitizedTolerance = sanitizeNumber(config.tolerance, 1e-6);
  const sanitizedIterations = Math.round(sanitizeNumber(config.maxIterations, 1));

  return {
    x0: sanitizeNumber(config.x0),
    x1: sanitizeNumber(config.x1),
    tolerance: Math.min(1e-1, Math.max(1e-10, sanitizedTolerance)),
    maxIterations: Math.max(1, Math.min(64, sanitizedIterations))
  };
}

export function buildPolynomialLatex({ a, b, c }: QuadraticCoefficients) {
  const termA = `${formatLatexNumber(a)}x^{2}`;
  const termB = `${b >= 0 ? "+" : "-"}\\,${formatLatexNumber(Math.abs(b))}x`;
  const termC = `${c >= 0 ? "+" : "-"}\\,${formatLatexNumber(Math.abs(c))}`;
  return `\\displaystyle f(x) = ${termA} ${termB} ${termC}`;
}

function formatLatexNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(3);
}

export function buildWizardSteps(secantConfig: SecantConfig, totalIterations: number) {
  return [
    {
      id: 1,
      title: "Intervalo inicial listo",
      detail: `x₀ = ${formatNumber(secantConfig.x0)} · x₁ = ${formatNumber(secantConfig.x1)}`,
      done: Math.abs(secantConfig.x1 - secantConfig.x0) > 0.25
    },
    {
      id: 2,
      title: "Precisión definida",
      detail: `Tolerancia ${formatScientific(secantConfig.tolerance)}`,
      done: secantConfig.tolerance <= 1e-3
    },
    {
      id: 3,
      title: "Iteraciones en marcha",
      detail: totalIterations ? `${totalIterations} pasos calculados` : "Aún no se ha iterado",
      done: totalIterations > 0
    }
  ];
}

export function getStatusPresentation(status: SecantResult["status"]) {
  switch (status) {
    case "converged":
      return { tone: "success" as const, label: "Convergió" };
    case "max_iter":
      return { tone: "warning" as const, label: "Límite alcanzado" };
    case "division_zero":
      return { tone: "danger" as const, label: "División indeterminada" };
    case "invalid":
      return { tone: "danger" as const, label: "Datos inválidos" };
    default:
      return { tone: "muted" as const, label: "Esperando datos" };
  }
}

export function rootDescription(solution: QuadraticSolution) {
  if (!solution.valid) return "Ecuación no válida";
  if (solution.status === "two-real") return "Dos raíces reales distintas";
  if (solution.status === "double-real") return "Raíz real doble";
  if (solution.status === "complex") return "Par de raíces complejas conjugadas";
  return "Estado desconocido";
}

export function formatRoot(value: { real: number; imag?: number }) {
  const hasImag = value.imag && Math.abs(value.imag) > 1e-9;
  if (hasImag) {
    const sign = value.imag && value.imag >= 0 ? "+" : "-";
    const imag = value.imag ? Math.abs(value.imag) : 0;
    return `${formatNumber(value.real)} ${sign} ${formatNumber(imag)}i`;
  }
  return formatNumber(value.real);
}

export function iterationDelta(iteration: SecantIteration) {
  return Math.abs(iteration.xNext - iteration.xCurr);
}
