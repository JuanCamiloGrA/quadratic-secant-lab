<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SecantResult, SecantIteration } from "$lib/math";
	import type { Tone } from "$lib/presentation/status-presenter";
	import { formatters } from "$lib/formatters";

	export let secantResult: SecantResult;
	export let totalIterations: number;
	export let selectedIteration: SecantIteration | undefined;
	export let badgeLabel: string;
	export let toneClasses: string;
	export let BadgeIcon: any;
</script>

<article class="rounded-3xl border border-slate-100/10 bg-white/90 p-6 shadow-2xl shadow-emerald-100">
	<header class="flex items-center justify-between">
		<div>
			<p class="text-xs uppercase tracking-widest text-slate-500">Estatus secante</p>
			<h2 class="text-lg font-semibold text-slate-900">{badgeLabel}</h2>
		</div>
		<span class={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", toneClasses)}>
			<svelte:component this={BadgeIcon} class="h-4 w-4" />
			{badgeLabel}
		</span>
	</header>
	<p class="mt-3 text-sm text-slate-600">{secantResult.reason}</p>
	<div class="mt-5 grid gap-4 sm:grid-cols-3">
		<div class="rounded-2xl border border-slate-100 bg-white p-4">
			<p class="text-xs uppercase tracking-widest text-slate-500">Aproximación</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">
				{formatters.formatNumber(secantResult.approx ?? NaN)}
			</p>
			<p class="text-xs text-slate-500">Último xₙ</p>
		</div>
		<div class="rounded-2xl border border-slate-100 bg-white p-4">
			<p class="text-xs uppercase tracking-widest text-slate-500">Iteraciones</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">{totalIterations}</p>
			<p class="text-xs text-slate-500">Generadas en tiempo real</p>
		</div>
		<div class="rounded-2xl border border-slate-100 bg-white p-4">
			<p class="text-xs uppercase tracking-widest text-slate-500">Error actual</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">
				{selectedIteration ? formatters.formatPercent(selectedIteration.error) : "—"}
			</p>
			<p class="text-xs text-slate-500">Relativo |xₙ₊₁ - xₙ|</p>
		</div>
	</div>
</article>
