<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SecantIteration } from "$lib/math";
	import { formatters } from "$lib/formatters";
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";

	export let totalIterations: number;
	export let selectedIterationIndex: number;
	export let selectedIteration: SecantIteration | undefined;
	export let highlightedIterations: SecantIteration[];
	export let onPrevious: () => void;
	export let onNext: () => void;

	function iterationDelta(iteration: SecantIteration): number {
		return Math.abs(iteration.xNext - iteration.xCurr);
	}
</script>

<article class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-2xl shadow-emerald-100">
	<header class="flex items-center justify-between">
		<div>
			<p class="text-xs uppercase tracking-widest text-slate-500">Secante paso a paso</p>
			<h2 class="text-lg font-semibold text-slate-900">Controla cada iteración</h2>
		</div>
		<div class="flex gap-2">
			<button
				class="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
				on:click={onPrevious}
				disabled={selectedIterationIndex === 0 || totalIterations === 0}
			>
				<ChevronLeft class="h-4 w-4" />
			</button>
			<button
				class="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
				on:click={onNext}
				disabled={selectedIterationIndex >= totalIterations - 1}
			>
				<ChevronRight class="h-4 w-4" />
			</button>
		</div>
	</header>

	{#if totalIterations > 0}
		<div class="mt-5 space-y-4">
			<label class="block text-sm text-slate-600">
				Iteración seleccionada: <strong class="text-slate-900">#{selectedIteration?.index}</strong>
				<input
					type="range"
					class="mt-2 w-full accent-emerald-500"
					min="0"
					max={Math.max(totalIterations - 1, 0)}
					step="1"
					bind:value={selectedIterationIndex}
				/>
			</label>
			<div class="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
				{#if selectedIteration}
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">xₙ</p>
							<p class="text-2xl font-semibold text-slate-900">{formatters.formatNumber(selectedIteration.xCurr)}</p>
						</div>
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">xₙ₊₁</p>
							<p class="text-2xl font-semibold text-slate-900">{formatters.formatNumber(selectedIteration.xNext)}</p>
						</div>
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">f(xₙ₊₁)</p>
							<p class="text-2xl font-semibold text-slate-900">{formatters.formatNumber(selectedIteration.fNext)}</p>
						</div>
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">Error relativo</p>
							<p class="text-2xl font-semibold text-emerald-600">{formatters.formatPercent(selectedIteration.error)}</p>
						</div>
					</div>
					<p class="mt-4 text-sm text-slate-500">
						Δ absoluto |xₙ₊₁ - xₙ| = {formatters.formatNumber(iterationDelta(selectedIteration))}
					</p>
				{:else}
					<p class="text-sm text-slate-500">Ajusta los parámetros para generar la primera iteración.</p>
				{/if}
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each highlightedIterations as iter}
					<div
						class={cn(
							"rounded-2xl border border-slate-100 bg-white/90 p-4 text-sm transition",
							selectedIteration && selectedIteration.index === iter.index
								? "ring-2 ring-emerald-200"
								: "hover:bg-slate-50"
						)}
					>
						<p class="text-xs uppercase tracking-widest text-slate-500">Iteración #{iter.index}</p>
						<p class="text-lg font-semibold text-slate-900">x = {formatters.formatNumber(iter.xNext)}</p>
						<p class="text-xs text-slate-500">Error {formatters.formatPercent(iter.error)}</p>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-slate-500">
			<p class="font-semibold text-slate-700">Aún no hay iteraciones</p>
			<p class="text-sm">Configura x₀, x₁ y una tolerancia para arrancar el método.</p>
		</div>
	{/if}
</article>
