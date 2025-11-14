/**
 * Presets Configuration - Open/Closed Principle
 * Pre-configured scenarios for testing
 */

import type { QuadraticCoefficients, SecantConfig } from "$lib/math";

export interface Preset {
	label: string;
	coefficients: QuadraticCoefficients;
	secant: SecantConfig;
}

export const presets: Preset[] = [
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
