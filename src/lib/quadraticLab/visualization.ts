import type { QuadraticSolution, SecantConfig, SecantIteration } from "$lib/math";

export interface SecantSeriesPoint {
  x: number;
  y: number;
  iteration: number;
  error: number;
}

export function deriveDomain(
  normalizedSecant: SecantConfig,
  quadratic: QuadraticSolution,
  iterations: SecantIteration[]
) {
  const bucket = [
    normalizedSecant.x0,
    normalizedSecant.x1,
    quadratic.vertex.x,
    ...quadratic.roots.map((root) => root.real),
    ...iterations.flatMap((iter) => [iter.xPrev, iter.xCurr, iter.xNext])
  ].filter((value) => Number.isFinite(value));

  if (!bucket.length) {
    return { min: -5, max: 5 };
  }

  const min = Math.min(...bucket);
  const max = Math.max(...bucket);
  const span = Math.max(max - min, 2);
  const padding = span * 0.35;

  return { min: min - padding, max: max + padding };
}

export function createSecantSeriesPoints(iterations: SecantIteration[]): SecantSeriesPoint[] {
  return iterations.map((iter) => ({
    x: iter.xNext,
    y: iter.fNext,
    iteration: iter.index,
    error: iter.error
  }));
}

export function buildChartSeries(polynomialSeries: Array<{ x: number; y: number }>, secantSeriesPoints: SecantSeriesPoint[]) {
  return [
    {
      key: "polinomio",
      label: "f(x)",
      color: "var(--chart-1)",
      data: polynomialSeries,
      value: (point: { y: number }) => point.y
    },
    {
      key: "secante",
      label: "Iteraciones de la secante",
      color: "var(--chart-3)",
      data: secantSeriesPoints,
      value: (point: { y: number }) => point.y,
      props: { class: "stroke-[2px] stroke-dashed" }
    }
  ];
}
