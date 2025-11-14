<script lang="ts">
	import type { QuadraticSolution } from "$lib/math";
	import { formatters } from "$lib/formatters";
	import Target from "lucide-svelte/icons/target";
	import AlertTriangle from "lucide-svelte/icons/alert-triangle";

	export let quadratic: QuadraticSolution;
	export let rootDescription: string;
</script>

<article class="rounded-3xl border border-slate-100/10 bg-white/90 p-6 shadow-2xl shadow-indigo-100">
	<header class="flex items-center justify-between">
		<div>
			<p class="text-xs uppercase tracking-widest text-slate-500">Diagnóstico cuadrático</p>
			<h2 class="text-lg font-semibold text-slate-900">{rootDescription}</h2>
		</div>
		<Target class="h-6 w-6 text-indigo-500" />
	</header>
	<div class="mt-6 grid gap-4 sm:grid-cols-2">
		<div class="rounded-2xl border border-slate-100 bg-white p-4">
			<p class="text-xs uppercase tracking-widest text-slate-500">Discriminante</p>
			<p class="mt-1 text-3xl font-semibold text-slate-900">
				{formatters.formatNumber(quadratic.discriminant)}
			</p>
			<p class="text-xs text-slate-500">D = b² - 4ac</p>
		</div>
		<div class="rounded-2xl border border-slate-100 bg-white p-4">
			<p class="text-xs uppercase tracking-widest text-slate-500">Vértice</p>
			<p class="mt-1 text-3xl font-semibold text-slate-900">
				({formatters.formatNumber(quadratic.vertex.x)}, {formatters.formatNumber(quadratic.vertex.y)})
			</p>
			<p class="text-xs text-slate-500">Centro geométrico de la parábola</p>
		</div>
	</div>
	<div class="mt-4 grid gap-4 sm:grid-cols-2">
		<div class="rounded-2xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-4">
			<p class="text-xs uppercase tracking-widest text-slate-500">Raíz 1</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">
				{formatters.formatRoot(quadratic.roots[0] ?? { real: NaN })}
			</p>
		</div>
		<div class="rounded-2xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-4">
			<p class="text-xs uppercase tracking-widest text-slate-500">Raíz 2</p>
			<p class="mt-1 text-2xl font-semibold text-slate-900">
				{formatters.formatRoot(quadratic.roots[1] ?? { real: NaN })}
			</p>
		</div>
	</div>
	{#if !quadratic.valid}
		<div class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
			<AlertTriangle class="mr-2 inline-block h-4 w-4" />
			Ajusta a ≠ 0 para desbloquear los cálculos.
		</div>
	{/if}
</article>
