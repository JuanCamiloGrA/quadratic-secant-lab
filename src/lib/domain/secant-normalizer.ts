/**
 * Secant Normalizer - Single Responsibility Principle
 * Normalizes and validates secant configuration input
 */

import type { SecantConfig } from "$lib/math";
import type { SecantKey } from "$lib/config/control-definitions";

export class SecantNormalizer {
	normalize(config: Record<SecantKey, number>): SecantConfig {
		return {
			x0: this.toNumber(config.x0),
			x1: this.toNumber(config.x1),
			tolerance: Math.min(1e-1, Math.max(1e-10, Number(config.tolerance) || 1e-6)),
			maxIterations: Math.max(1, Math.min(64, Math.round(Number(config.maxIterations) || 1)))
		};
	}

	private toNumber(value: number | string): number {
		const numeric = Number(value);
		return Number.isFinite(numeric) ? numeric : 0;
	}
}

export const secantNormalizer = new SecantNormalizer();
