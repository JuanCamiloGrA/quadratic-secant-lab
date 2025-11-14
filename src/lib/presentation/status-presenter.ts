/**
 * Status Presenter - Single Responsibility Principle
 * Handles status presentation logic (colors, icons, labels)
 */

import type { SecantResult, QuadraticSolution } from "$lib/math";
import Activity from "lucide-svelte/icons/activity";
import AlertTriangle from "lucide-svelte/icons/alert-triangle";
import CheckCircle2 from "lucide-svelte/icons/check-circle-2";
import XCircle from "lucide-svelte/icons/x-circle";

export type Tone = "success" | "warning" | "danger" | "muted";

export interface StatusPresentation {
	tone: Tone;
	label: string;
}

export class StatusPresenter {
	private readonly iconByTone = {
		success: CheckCircle2,
		warning: AlertTriangle,
		danger: XCircle,
		muted: Activity
	} as const;

	private readonly toneClasses = {
		success: "bg-emerald-100 text-emerald-900 border border-emerald-200",
		warning: "bg-amber-100 text-amber-900 border border-amber-200",
		danger: "bg-rose-100 text-rose-900 border border-rose-200",
		muted: "bg-zinc-100 text-zinc-700 border border-zinc-200"
	} as const;

	getSecantPresentation(status: SecantResult["status"]): StatusPresentation {
		switch (status) {
			case "converged":
				return { tone: "success", label: "Convergió" };
			case "max_iter":
				return { tone: "warning", label: "Límite alcanzado" };
			case "division_zero":
				return { tone: "danger", label: "División indeterminada" };
			case "invalid":
				return { tone: "danger", label: "Datos inválidos" };
			default:
				return { tone: "muted", label: "Esperando datos" };
		}
	}

	getQuadraticDescription(quadratic: QuadraticSolution): string {
		if (!quadratic.valid) return "Ecuación no válida";
		if (quadratic.status === "two-real") return "Dos raíces reales distintas";
		if (quadratic.status === "double-real") return "Raíz real doble";
		if (quadratic.status === "complex") return "Par de raíces complejas conjugadas";
		return "Estado desconocido";
	}

	getIconForTone(tone: Tone) {
		return this.iconByTone[tone];
	}

	getClassesForTone(tone: Tone): string {
		return this.toneClasses[tone];
	}
}

export const statusPresenter = new StatusPresenter();
