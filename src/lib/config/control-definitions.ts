/**
 * Control Definitions - Open/Closed Principle
 * Configuration data for UI controls
 */

import type { QuadraticCoefficients } from "$lib/math";

export type CoefficientKey = keyof QuadraticCoefficients;
export type SecantKey = "x0" | "x1" | "tolerance" | "maxIterations";

export interface ControlDefinition<T extends string> {
	key: T;
	label: string;
	description: string;
	min: number;
	max: number;
	step: number;
}

export const coefficientControls: Array<ControlDefinition<CoefficientKey>> = [
	{
		key: "a",
		label: "Coeficiente a",
		description: "Curvatura de la parábola",
		min: -5,
		max: 5,
		step: 0.25
	},
	{
		key: "b",
		label: "Coeficiente b",
		description: "Desplaza la parábola horizontalmente",
		min: -10,
		max: 10,
		step: 0.25
	},
	{
		key: "c",
		label: "Término independiente c",
		description: "Corte con el eje Y",
		min: -12,
		max: 12,
		step: 0.25
	}
];

export const secantControls: Array<ControlDefinition<SecantKey>> = [
	{
		key: "x0",
		label: "x₀",
		description: "Primer intento",
		min: -10,
		max: 10,
		step: 0.25
	},
	{
		key: "x1",
		label: "x₁",
		description: "Segundo intento",
		min: -10,
		max: 10,
		step: 0.25
	},
	{
		key: "tolerance",
		label: "Tolerancia",
		description: "Error relativo deseado",
		min: 1e-7,
		max: 1e-2,
		step: 1e-7
	},
	{
		key: "maxIterations",
		label: "Iteraciones máx.",
		description: "Tope de refinamientos",
		min: 1,
		max: 64,
		step: 1
	}
];
