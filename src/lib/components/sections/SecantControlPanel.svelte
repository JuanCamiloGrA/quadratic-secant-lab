<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SecantKey, ControlDefinition } from "$lib/config/control-definitions";
	import type { WizardStep } from "$lib/domain/wizard-builder";
	import Activity from "lucide-svelte/icons/activity";

	export let secantConfig: Record<SecantKey, number>;
	export let controls: Array<ControlDefinition<SecantKey>>;
	export let wizardSteps: WizardStep[];
	export let onUpdate: (key: SecantKey, value: number | string) => void;
</script>

<article class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-xl shadow-slate-200/50">
	<header class="flex items-center justify-between">
		<div>
			<p class="text-xs uppercase tracking-widest text-slate-500">Paso 2</p>
			<h2 class="text-lg font-semibold text-slate-900">Parámetros de la secante</h2>
		</div>
		<span class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
			<Activity class="h-4 w-4" />
			Tiempo real
		</span>
	</header>
	<div class="mt-6 space-y-4">
		{#each controls as control}
			<label class="block space-y-1 text-sm text-slate-700">
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
						value={secantConfig[control.key]}
						on:input={(event) => onUpdate(control.key, event.currentTarget.value)}
					/>
					{#if control.key !== "maxIterations"}
						<input
							type="range"
							class="mt-3 w-full accent-indigo-500"
							min={control.min}
							max={control.max}
							step={control.step}
							value={secantConfig[control.key]}
							on:input={(event) => onUpdate(control.key, event.currentTarget.value)}
						/>
					{/if}
				</div>
			</label>
		{/each}
	</div>
	<div class="mt-6 space-y-3">
		{#each wizardSteps as step}
			<div class="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm">
				<div
					class={cn(
						"flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
						step.done ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"
					)}
				>
					{step.id}
				</div>
				<div>
					<p class={cn("font-semibold", step.done ? "text-slate-900" : "text-slate-500")}>{step.title}</p>
					<p class="text-xs text-slate-500">{step.detail}</p>
				</div>
			</div>
		{/each}
	</div>
</article>
