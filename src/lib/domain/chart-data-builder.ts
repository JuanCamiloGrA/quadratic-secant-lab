/**
 * Chart Data Builder - Single Responsibility Principle
 * Builds chart data from mathematical results
 */

import type { QuadraticCoefficients, SecantIteration, QuadraticSolution } from "$lib/math";
import { generateQuadraticSamples } from "$lib/math";

export interface ChartDomain {
	min: number;
	max: number;
}

export interface ChartPoint {
	x: number;
	y: number;
}

export interface SecantChartPoint extends ChartPoint {
	iteration: number;
	error: number;
}

export interface ChartSeries {
	key: string;
	label: string;
	color: string;
	data: ChartPoint[] | SecantChartPoint[];
	value: (point: ChartPoint) => number;
	props?: Record<string, unknown>;
}

export class ChartDataBuilder {
	deriveDomain(
		secantConfig: { x0: number; x1: number },
		quadratic: QuadraticSolution,
		iterations: SecantIteration[]
	): ChartDomain {
		const bucket = [
			secantConfig.x0,
			secantConfig.x1,
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

	buildPolynomialSeries(
		coefficients: QuadraticCoefficients,
		domain: ChartDomain
	): ChartPoint[] {
		return generateQuadraticSamples(coefficients, domain, 320);
	}

	buildSecantPoints(iterations: SecantIteration[]): SecantChartPoint[] {
		return iterations.map((iter) => ({
			x: iter.xNext,
			y: iter.fNext,
			iteration: iter.index,
			error: iter.error
		}));
	}

	buildChartSeries(
		polynomialData: ChartPoint[],
		secantPoints: SecantChartPoint[]
	): ChartSeries[] {
		return [
			{
				key: "polinomio",
				label: "f(x)",
				color: "var(--chart-1)",
				data: polynomialData,
				value: (point: ChartPoint) => point.y
			},
			{
				key: "secante",
				label: "Iteraciones de la secante",
				color: "var(--chart-3)",
				data: secantPoints,
				value: (point: ChartPoint) => point.y,
				props: { class: "stroke-[2px] stroke-dashed" }
			}
		];
	}
}

export const chartDataBuilder = new ChartDataBuilder();
