/**
 * Wizard Builder - Single Responsibility Principle
 * Builds wizard step information
 */

import { formatters } from "$lib/formatters";

export interface WizardStep {
	id: number;
	title: string;
	detail: string;
	done: boolean;
}

export class WizardBuilder {
	buildSteps(
		secantConfig: { x0: number; x1: number; tolerance: number },
		totalIterations: number
	): WizardStep[] {
		return [
			{
				id: 1,
				title: "Intervalo inicial listo",
				detail: `x₀ = ${formatters.formatNumber(secantConfig.x0, 3)} · x₁ = ${formatters.formatNumber(
					secantConfig.x1,
					3
				)}`,
				done: Math.abs(secantConfig.x1 - secantConfig.x0) > 0.25
			},
			{
				id: 2,
				title: "Precisión definida",
				detail: `Tolerancia ${formatters.formatScientific(secantConfig.tolerance)}`,
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
}

export const wizardBuilder = new WizardBuilder();
