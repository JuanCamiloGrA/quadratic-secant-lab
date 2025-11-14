<script lang="ts">
	import MathBlock from "$lib/components/MathBlock.svelte";
	import Sparkles from "lucide-svelte/icons/sparkles";

	export let generalFormula: string;
	export let secantFormula: string;
	export let polynomialLatex: string;
</script>

<section class="rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-900/80 to-slate-800 p-8 text-white shadow-2xl">
	<div class="flex flex-col gap-8 lg:flex-row">
		<div class="flex-1 space-y-4">
			<div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-widest text-emerald-200">
				<Sparkles class="h-4 w-4" />
				Cálculo en tiempo real
			</div>
			<div class="space-y-2">
				<h1 class="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
					Laboratorio interactivo: fórmula cuadrática y método de la secante
				</h1>
				<p class="max-w-2xl text-lg text-slate-200">
					Ajusta coeficientes, define iteraciones iniciales y observa cómo los resultados se actualizan al instante. Esta pantalla combina visuales premium con cálculos exactos para entender cada paso del proceso.
				</p>
			</div>
			<div class="flex flex-wrap gap-3 text-sm text-slate-100">
				<span class="rounded-full border border-white/20 bg-white/10 px-3 py-1">
					Seguimiento iteración por iteración
				</span>
				<span class="rounded-full border border-white/20 bg-white/10 px-3 py-1">
					Raíces exactas (reales o complejas)
				</span>
				<span class="rounded-full border border-white/20 bg-white/10 px-3 py-1">
					Visualización animada de f(x)
				</span>
			</div>
		</div>
		<div class="flex flex-1 flex-col gap-4">
			<div class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center backdrop-blur">
				<p class="text-xs uppercase tracking-widest text-white">Fórmula cuadrática</p>
				<MathBlock expression={generalFormula} ariaLabel="Fórmula cuadrática" />
			</div>
			<div class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center backdrop-blur">
				<p class="text-xs uppercase tracking-widest text-white">Método de la secante</p>
				<MathBlock expression={secantFormula} ariaLabel="Fórmula de la secante" />
			</div>
			<div class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center backdrop-blur">
				<p class="text-xs uppercase tracking-widest text-white">Ecuación actual</p>
				<MathBlock expression={polynomialLatex} ariaLabel="Ecuación cuadrática actual" />
			</div>
		</div>
	</div>
</section>
