<script lang="ts">
	import type { QuadraticCoefficients } from "$lib/math";
	import type { CoefficientKey, ControlDefinition } from "$lib/config/control-definitions";
	import type { Preset } from "$lib/config/presets";
	import RefreshCw from "lucide-svelte/icons/refresh-cw";

	export let coefficients: QuadraticCoefficients;
	export let controls: Array<ControlDefinition<CoefficientKey>>;
	export let presets: Preset[];
	export let onUpdate: (key: CoefficientKey, value: number | string) => void;
	export let onPresetApply: (index: number) => void;
</script>

<article class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-xl shadow-slate-200/50">
	<header class="flex items-center justify-between">
		<div>
			<p class="text-xs uppercase tracking-widest text-slate-500">Paso 1</p>
			<h2 class="text-lg font-semibold text-slate-900">Coeficientes de la ecuación</h2>
		</div>
		<button
			class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
			on:click={() => onPresetApply(0)}
		>
			<RefreshCw class="h-4 w-4" />
			Ejemplo rápido
		</button>
	</header>
	<div class="mt-6 space-y-5">
		{#each controls as control}
			<label class="block space-y-2 text-sm text-slate-700">
				<div class="flex items-center justify-between text-xs uppercase tracking-widest text-slate-500">
					<span>{control.label}</span>
					<span>{control.description}</span>
				</div>
				<div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
					<input
						type="number"
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
						step={control.step}
						min={control.min}
						max={control.max}
						value={coefficients[control.key]}
						on:input={(event) => onUpdate(control.key, event.currentTarget.value)}
					/>
					<input
						type="range"
						class="mt-3 w-full accent-emerald-500"
						min={control.min}
						max={control.max}
						step={control.step}
						value={coefficients[control.key]}
						on:input={(event) => onUpdate(control.key, event.currentTarget.value)}
					/>
				</div>
				{#if control.key === "a" && Math.abs(coefficients.a) < 1e-8}
					<p class="text-xs text-rose-600">Recuerda: a ≠ 0 para mantener una ecuación cuadrática.</p>
				{/if}
			</label>
		{/each}
	</div>
	<div class="mt-4 flex flex-wrap gap-2 text-xs">
		{#each presets as preset, index}
			<button
				class="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
				on:click={() => onPresetApply(index)}
			>
				{preset.label}
			</button>
		{/each}
	</div>
</article>
