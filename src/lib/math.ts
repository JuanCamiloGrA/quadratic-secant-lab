export interface QuadraticCoefficients {
  a: number;
  b: number;
  c: number;
}

export type QuadraticStatus = "invalid" | "two-real" | "double-real" | "complex";

export interface RootValue {
  real: number;
  imag?: number;
}

export interface QuadraticSolution {
  valid: boolean;
  status: QuadraticStatus;
  discriminant: number;
  roots: RootValue[];
  vertex: { x: number; y: number };
  message?: string;
}

export interface SecantConfig {
  x0: number;
  x1: number;
  tolerance: number;
  maxIterations: number;
}

export type SecantStatus = "idle" | "invalid" | "converged" | "max_iter" | "division_zero";

export interface SecantIteration {
  index: number;
  xPrev: number;
  xCurr: number;
  xNext: number;
  fPrev: number;
  fCurr: number;
  fNext: number;
  error: number;
  slope: number;
}

export interface SecantResult {
  status: SecantStatus;
  iterations: SecantIteration[];
  approx?: number;
  reason: string;
}

const EPS = 1e-12;

export function evaluatePolynomial(coeffs: QuadraticCoefficients, x: number): number {
  return coeffs.a * x * x + coeffs.b * x + coeffs.c;
}

export function solveQuadratic(coeffs: QuadraticCoefficients): QuadraticSolution {
  const { a, b, c } = coeffs;

  if (!Number.isFinite(a) || Math.abs(a) < EPS) {
    return {
      valid: false,
      status: "invalid",
      discriminant: Number.NaN,
      roots: [],
      vertex: { x: Number.NaN, y: Number.NaN },
      message: "El coeficiente a debe ser distinto de cero para que la ecuación sea cuadrática."
    };
  }

  const discriminant = b * b - 4 * a * c;
  const twoA = 2 * a;
  const vertexX = -b / twoA;
  const vertexY = evaluatePolynomial(coeffs, vertexX);

  if (discriminant > EPS) {
    const sqrtD = Math.sqrt(discriminant);
    return {
      valid: true,
      status: "two-real",
      discriminant,
      roots: [
        { real: (-b + sqrtD) / twoA, imag: 0 },
        { real: (-b - sqrtD) / twoA, imag: 0 }
      ],
      vertex: { x: vertexX, y: vertexY }
    };
  }

  if (Math.abs(discriminant) <= EPS) {
    const root = -b / twoA;
    return {
      valid: true,
      status: "double-real",
      discriminant,
      roots: [
        { real: root, imag: 0 },
        { real: root, imag: 0 }
      ],
      vertex: { x: vertexX, y: vertexY }
    };
  }

  const imagMagnitude = Math.sqrt(-discriminant) / Math.abs(twoA);
  const realPart = -b / twoA;
  return {
    valid: true,
    status: "complex",
    discriminant,
    roots: [
      { real: realPart, imag: imagMagnitude },
      { real: realPart, imag: -imagMagnitude }
    ],
    vertex: { x: vertexX, y: vertexY }
  };
}

export function runSecant(
  coeffs: QuadraticCoefficients,
  config: SecantConfig
): SecantResult {
  if (!Number.isFinite(coeffs.a) || Math.abs(coeffs.a) < EPS) {
    return {
      status: "invalid",
      iterations: [],
      reason: "La secante necesita una ecuación cuadrática válida (a ≠ 0)."
    };
  }

  const tolerance = Math.max(EPS, Math.abs(config.tolerance) || 1e-6);
  const maxIterations = Math.max(1, Math.min(64, Math.round(config.maxIterations || 1)));

  let xPrev = config.x0;
  let xCurr = config.x1;
  let fPrev = evaluatePolynomial(coeffs, xPrev);
  let fCurr = evaluatePolynomial(coeffs, xCurr);

  const iterations: SecantIteration[] = [];

  for (let index = 1; index <= maxIterations; index += 1) {
    const denominator = fCurr - fPrev;

    if (Math.abs(denominator) < EPS) {
      return {
        status: "division_zero",
        iterations,
        reason: "La secante se detuvo porque f(x_n) ≈ f(x_{n-1}), lo que provoca división por cero."
      };
    }

    const xNext = xCurr - (fCurr * (xCurr - xPrev)) / denominator;
    const fNext = evaluatePolynomial(coeffs, xNext);
    const error = Math.abs(xNext - xCurr) / Math.max(Math.abs(xNext), 1);

    iterations.push({
      index,
      xPrev,
      xCurr,
      xNext,
      fPrev,
      fCurr,
      fNext,
      error,
      slope: (fCurr - fPrev) / (xCurr - xPrev || EPS)
    });

    if (error <= tolerance) {
      return {
        status: "converged",
        iterations,
        approx: xNext,
        reason: `Se alcanzó la tolerancia en ${index} iteraciones.`
      };
    }

    xPrev = xCurr;
    fPrev = fCurr;
    xCurr = xNext;
    fCurr = fNext;
  }

  return {
    status: "max_iter",
    iterations,
    approx: iterations.at(-1)?.xNext,
    reason: "Se alcanzó el máximo de iteraciones sin cumplir la tolerancia."
  };
}

export function generateQuadraticSamples(
  coeffs: QuadraticCoefficients,
  domain: { min: number; max: number },
  sampleCount = 300
): Array<{ x: number; y: number }> {
  const min = Number.isFinite(domain.min) ? domain.min : -5;
  const max = Number.isFinite(domain.max) ? domain.max : 5;
  const safeMin = min === max ? min - 1 : min;
  const safeMax = min === max ? max + 1 : max;
  const span = safeMax - safeMin;
  const step = span / Math.max(sampleCount - 1, 1);

  return Array.from({ length: sampleCount }, (_, i) => {
    const x = safeMin + step * i;
    return { x, y: evaluatePolynomial(coeffs, x) };
  });
}
