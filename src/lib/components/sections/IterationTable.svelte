<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SecantIteration } from "$lib/math";
	import { formatters } from "$lib/formatters";

	export let iterations: SecantIteration[];
	export let selectedIteration: SecantIteration | undefined;
</script>

<section class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-xl shadow-slate-200/60">
	<header class="flex items-center justify-between">
		<div>
			<p class="text-xs uppercase tracking-widest text-slate-500">Detalle iterativo</p>
			<h2 class="text-lg font-semibold text-slate-900">Tabla completa del método de la secante</h2>
		</div>
	</header>
	<div class="mt-4 overflow-x-auto">
		<table class="w-full min-w-[760px] text-left text-sm">
			<thead>
				<tr class="text-xs uppercase tracking-widest text-slate-500">
					<th class="pb-3 pr-4 font-semibold">Iter.</th>
					<th class="pb-3 pr-4 font-semibold">xₙ₋₁</th>
					<th class="pb-3 pr-4 font-semibold">xₙ</th>
					<th class="pb-3 pr-4 font-semibold">f(xₙ₋₁)</th>
					<th class="pb-3 pr-4 font-semibold">f(xₙ)</th>
					<th class="pb-3 pr-4 font-semibold">xₙ₊₁</th>
					<th class="pb-3 pr-4 font-semibold">f(xₙ₊₁)</th>
					<th class="pb-3 pr-4 font-semibold">Error</th>
				</tr>
			</thead>
			<tbody>
				{#if iterations.length === 0}
					<tr>
						<td class="py-4 text-center text-slate-500" colspan="8">Aún no hay datos para mostrar.</td>
					</tr>
				{:else}
					{#each iterations as iteration}
						<tr
							class={cn(
								"border-t border-slate-100 text-slate-700 transition hover:bg-slate-50",
								selectedIteration && selectedIteration.index === iteration.index &&
									"bg-emerald-50/60 text-emerald-900"
							)}
						>
							<td class="py-3 pr-4 font-semibold">#{iteration.index}</td>
							<td class="py-3 pr-4">{formatters.formatNumber(iteration.xPrev)}</td>
							<td class="py-3 pr-4">{formatters.formatNumber(iteration.xCurr)}</td>
							<td class="py-3 pr-4">{formatters.formatNumber(iteration.fPrev)}</td>
							<td class="py-3 pr-4">{formatters.formatNumber(iteration.fCurr)}</td>
							<td class="py-3 pr-4 font-semibold text-slate-900">
								{formatters.formatNumber(iteration.xNext)}
							</td>
							<td class="py-3 pr-4">{formatters.formatNumber(iteration.fNext)}</td>
							<td class="py-3 pr-4 text-emerald-600">{formatters.formatPercent(iteration.error)}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</section>
