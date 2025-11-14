<script lang="ts">
	import MathBlock from "$lib/components/MathBlock.svelte";
	import { cn } from "$lib/utils";
	import {
		evaluatePolynomial,
		generateQuadraticSamples,
		runSecant,
		solveQuadratic,
		type QuadraticCoefficients,
		type SecantIteration,
		type SecantResult
	} from "$lib/math";
	import Sparkles from "lucide-svelte/icons/sparkles";
	import Activity from "lucide-svelte/icons/activity";
	import RefreshCw from "lucide-svelte/icons/refresh-cw";
	import AlertTriangle from "lucide-svelte/icons/alert-triangle";
	import CheckCircle2 from "lucide-svelte/icons/check-circle-2";
	import XCircle from "lucide-svelte/icons/x-circle";
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import Target from "lucide-svelte/icons/target";
	import TrendingUp from "lucide-svelte/icons/trending-up";
	import { LineChart } from "layerchart";

	type CoefficientKey = keyof QuadraticCoefficients;
	type Tone = "success" | "warning" | "danger" | "muted";

	const numberFormatter = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 6 });
	const compactFormatter = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 3 });
	const scientificFormatter = new Intl.NumberFormat("es-ES", {
		notation: "scientific",
		maximumFractionDigits: 2
	});

	const coefficientControls: Array<{
		key: CoefficientKey;
		label: string;
		description: string;
		min: number;
		max: number;
		step: number;
	}> = [
		{ key: "a", label: "Coeficiente a", description: "Curvatura de la parábola", min: -5, max: 5, step: 0.25 },
		{
			key: "b",
			label: "Coeficiente b",
			description: "Desplaza la parábola horizontalmente",
			min: -10,
			max: 10,
			step: 0.25
		},
		{
			key: "c",
			label: "Término independiente c",
			description: "Corte con el eje Y",
			min: -12,
			max: 12,
			step: 0.25
		}
	];

	type SecantKey = "x0" | "x1" | "tolerance" | "maxIterations";
	const secantControls: Array<{
		key: SecantKey;
		label: string;
		description: string;
		min: number;
		max: number;
		step: number;
	}> = [
		{ key: "x0", label: "x₀", description: "Primer intento", min: -10, max: 10, step: 0.25 },
		{ key: "x1", label: "x₁", description: "Segundo intento", min: -10, max: 10, step: 0.25 },
		{ key: "tolerance", label: "Tolerancia", description: "Error relativo deseado", min: 1e-7, max: 1e-2, step: 1e-7 },
		{ key: "maxIterations", label: "Iteraciones máx.", description: "Tope de refinamientos", min: 1, max: 64, step: 1 }
	];

	const presets = [
		{
			label: "Raíces limpias",
			coefficients: { a: 1, b: -3, c: -4 },
			secant: { x0: -2, x1: 4, tolerance: 1e-6, maxIterations: 18 }
		},
		{
			label: "Complejas",
			coefficients: { a: 2, b: 4, c: 8 },
			secant: { x0: -2, x1: 1, tolerance: 1e-5, maxIterations: 20 }
		},
		{
			label: "Raíz doble",
			coefficients: { a: 1, b: -2, c: 1 },
			secant: { x0: -1, x1: 3, tolerance: 1e-7, maxIterations: 25 }
		}
	];

	let coefficients: QuadraticCoefficients = { a: 1, b: -4, c: 3 };
	let secantConfig: Record<SecantKey, number> = {
		x0: -1,
		x1: 3.2,
		tolerance: 1e-5,
		maxIterations: 18
	};
	let selectedIterationIndex = 0;

	const generalFormula = "\\displaystyle x = \\frac{-b \\pm \\sqrt{b^{2}-4ac}}{2a}";
	const secantFormula =
		"\\displaystyle x_{n+1} = x_n - f(x_n) \\cdot \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}";

	$: normalizedSecant = {
		x0: toNumber(secantConfig.x0),
		x1: toNumber(secantConfig.x1),
		tolerance: Math.min(1e-1, Math.max(1e-10, Number(secantConfig.tolerance) || 1e-6)),
		maxIterations: Math.max(1, Math.min(64, Math.round(Number(secantConfig.maxIterations) || 1)))
	};

	$: quadratic = solveQuadratic(coefficients);
	$: polynomialLatex = buildPolynomialLatex(coefficients);
	$: secantResult = runSecant(coefficients, normalizedSecant);
	$: iterations = secantResult.iterations;
	$: totalIterations = iterations.length;

	$: {
		const maxIndex = Math.max(totalIterations - 1, 0);
		if (selectedIterationIndex > maxIndex) {
			selectedIterationIndex = maxIndex;
		}
		if (selectedIterationIndex < 0) {
			selectedIterationIndex = 0;
		}
	}

	$: selectedIteration = iterations[selectedIterationIndex];
	$: chartDomain = deriveDomain();
	$: polynomialSeries = generateQuadraticSamples(coefficients, chartDomain, 320);
	$: secantSeriesPoints = iterations.map((iter) => ({
		x: iter.xNext,
		y: iter.fNext,
		iteration: iter.index,
		error: iter.error
	}));
	$: chartSeries = [
		{
			key: "polinomio",
			label: "f(x)",
			color: "var(--chart-1)",
			data: polynomialSeries,
			value: (point: { y: number }) => point.y
		},
		{
			key: "secante",
			label: "Iteraciones de la secante",
			color: "var(--chart-3)",
			data: secantSeriesPoints,
			value: (point: { y: number }) => point.y,
			props: { class: "stroke-[2px] stroke-dashed" }
		}
	];
	$: highlightedIterations = iterations.slice(0, 3);
	$: wizardSteps = buildWizardSteps();
	$: selectedPoint = selectedIteration
		? { x: selectedIteration.xNext, y: selectedIteration.fNext }
		: null;
	$: secantPresentation = getStatusPresentation(secantResult.status);
	$: secantBadgeTone = secantPresentation.tone;
	$: BadgeIcon = iconByTone[secantBadgeTone];

	const iconByTone: Record<Tone, typeof CheckCircle2> = {
		success: CheckCircle2,
		warning: AlertTriangle,
		danger: XCircle,
		muted: Activity
	};

	const toneClasses: Record<Tone, string> = {
		success: "bg-emerald-100 text-emerald-900 border border-emerald-200",
		warning: "bg-amber-100 text-amber-900 border border-amber-200",
		danger: "bg-rose-100 text-rose-900 border border-rose-200",
		muted: "bg-zinc-100 text-zinc-700 border border-zinc-200"
	};

	const detailItems = [
		{
			title: "¿Por qué fórmula general?",
			body:
				"La fórmula cuadrática entrega una solución cerrada basada en el discriminante. Incluso para raíces complejas mantenemos precisión exacta." 
		},
		{
			title: "¿Cómo funciona la secante?",
			body:
				"La secante aproxima la derivada con pendientes formadas por dos puntos consecutivos de f(x). No requiere derivadas explícitas y converge rápido si partimos cerca de la raíz." 
		},
		{
			title: "Qué observar en la gráfica",
			body:
				"Cada iteración se dibuja sobre f(x) con colores graduados. Selecciona pasos para ver cómo el error cae casi exponencialmente." 
		}
	];

	function toNumber(value: number | string) {
		const numeric = Number(value);
		return Number.isFinite(numeric) ? numeric : 0;
	}

	function buildPolynomialLatex({ a, b, c }: QuadraticCoefficients) {
		const termA = `${formatLatexNumber(a)}x^{2}`;
		const termB = `${b >= 0 ? "+" : "-"}\\,${formatLatexNumber(Math.abs(b))}x`;
		const termC = `${c >= 0 ? "+" : "-"}\\,${formatLatexNumber(Math.abs(c))}`;
		return `\\displaystyle f(x) = ${termA} ${termB} ${termC}`;
	}

	function formatLatexNumber(value: number) {
		if (!Number.isFinite(value)) return "0";
		return value.toFixed(3);
	}

	function formatNumber(value: number, digits = 6) {
		if (!Number.isFinite(value)) return "—";
		return new Intl.NumberFormat("es-ES", { maximumFractionDigits: digits }).format(value);
	}

	function formatPercent(value: number) {
		if (!Number.isFinite(value)) return "—";
		return `${(value * 100).toFixed(4)} %`;
	}

	function formatScientific(value: number) {
		if (!Number.isFinite(value)) return "—";
		return scientificFormatter.format(value);
	}

	function deriveDomain() {
		const bucket = [
			normalizedSecant.x0,
			normalizedSecant.x1,
			quadratic.vertex.x,
			...quadratic.roots.map((root) => root.real),
			...iterations.flatMap((iter) => [iter.xPrev, iter.xCurr, iter.xNext])
		].filter((value) => Number.isFinite(value));

		if (!bucket.length) {
			return { min: -5, max: 5 };
		}

		const min = Math.min(...bucket);
		const max = Math.max(...bucket);
		const span = Math.max(max - min, 2);
		const padding = span * 0.35;

		return { min: min - padding, max: max + padding };
	}

	function buildWizardSteps() {
		return [
			{
				id: 1,
				title: "Intervalo inicial listo",
				detail: `x₀ = ${formatNumber(normalizedSecant.x0, 3)} · x₁ = ${formatNumber(
					normalizedSecant.x1,
					3
				)}`,
				done: Math.abs(normalizedSecant.x1 - normalizedSecant.x0) > 0.25
			},
			{
				id: 2,
				title: "Precisión definida",
				detail: `Tolerancia ${formatScientific(normalizedSecant.tolerance)}`,
				done: normalizedSecant.tolerance <= 1e-3
			},
			{
				id: 3,
				title: "Iteraciones en marcha",
				detail: totalIterations ? `${totalIterations} pasos calculados` : "Aún no se ha iterado",
				done: totalIterations > 0
			}
		];
	}

	function getStatusPresentation(status: SecantResult["status"]): { tone: Tone; label: string } {
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

	function applyPreset(presetIndex: number) {
		const preset = presets[presetIndex];
		coefficients = structuredClone(preset.coefficients);
		secantConfig = structuredClone(preset.secant) as typeof secantConfig;
		selectedIterationIndex = 0;
	}

	function goPrevious() {
		if (selectedIterationIndex > 0) {
			selectedIterationIndex -= 1;
		}
	}

	function goNext() {
		if (selectedIterationIndex < totalIterations - 1) {
			selectedIterationIndex += 1;
		}
	}

	function iterationDelta(iteration: SecantIteration) {
		return Math.abs(iteration.xNext - iteration.xCurr);
	}

	function rootDescription() {
		if (!quadratic.valid) return "Ecuación no válida";
		if (quadratic.status === "two-real") return "Dos raíces reales distintas";
		if (quadratic.status === "double-real") return "Raíz real doble";
		if (quadratic.status === "complex") return "Par de raíces complejas conjugadas";
		return "Estado desconocido";
	}

	function formatRoot(value: { real: number; imag?: number }) {
		const hasImag = value.imag && Math.abs(value.imag) > 1e-9;
		if (hasImag) {
			const sign = value.imag && value.imag >= 0 ? "+" : "-";
			const imag = value.imag ? Math.abs(value.imag) : 0;
			return `${formatNumber(value.real)} ${sign} ${formatNumber(imag)}i`;
		}
		return formatNumber(value.real);
	}

	function updateCoefficient(key: CoefficientKey, value: number | string) {
		const numeric = Number(value);
		coefficients = {
			...coefficients,
			[key]: Number.isFinite(numeric) ? numeric : coefficients[key]
		};
	}

	function updateSecantValue(key: SecantKey, value: number | string) {
		const numeric = Number(value);
		secantConfig = {
			...secantConfig,
			[key]: Number.isFinite(numeric) ? numeric : secantConfig[key]
		};
	}
</script>

<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_45%)] py-10">
	<main class="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
		<section class="rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-900/80 to-slate-800 p-8 text-white shadow-2xl">
			<div class="flex flex-col gap-8 lg:flex-row">
				<div class="flex-1 space-y-4">
					<div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-widest text-emerald-200">
						<Sparkles class="h-4 w-4" />
						Interfaz viva · cálculo en tiempo real
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
						<p class="text-xs uppercase tracking-widest text-white/80">Fórmula general</p>
						<MathBlock expression={generalFormula} ariaLabel="Fórmula cuadrática" />
					</div>
					<div class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center backdrop-blur">
						<p class="text-xs uppercase tracking-widest text-white/80">Método de la secante</p>
						<MathBlock expression={secantFormula} ariaLabel="Fórmula de la secante" />
					</div>
					<div class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center backdrop-blur">
						<p class="text-xs uppercase tracking-widest text-white/80">Ecuación actual</p>
						<MathBlock expression={polynomialLatex} ariaLabel="Ecuación cuadrática actual" />
					</div>
				</div>
			</div>
		</section>

		<section class="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
			<div class="space-y-6">
				<article class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-xl shadow-slate-200/50">
					<header class="flex items-center justify-between">
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">Paso 1</p>
							<h2 class="text-lg font-semibold text-slate-900">Coeficientes de la ecuación</h2>
						</div>
						<button
							class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
							on:click={() => applyPreset(0)}
						>
							<RefreshCw class="h-4 w-4" />
							Ejemplo rápido
						</button>
					</header>
					<div class="mt-6 space-y-5">
						{#each coefficientControls as control}
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
										on:input={(event) => updateCoefficient(control.key, event.currentTarget.value)}
									/>
									<input
										type="range"
										class="mt-3 w-full accent-emerald-500"
										min={control.min}
										max={control.max}
										step={control.step}
										value={coefficients[control.key]}
										on:input={(event) => updateCoefficient(control.key, event.currentTarget.value)}
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
								on:click={() => applyPreset(index)}
							>
								{preset.label}
							</button>
						{/each}
					</div>
				</article>

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
						{#each secantControls as control}
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
										on:input={(event) => updateSecantValue(control.key, event.currentTarget.value)}
									/>
									{#if control.key !== "maxIterations"}
										<input
											type="range"
											class="mt-3 w-full accent-indigo-500"
											min={control.min}
											max={control.max}
											step={control.step}
											value={secantConfig[control.key]}
											on:input={(event) => updateSecantValue(control.key, event.currentTarget.value)}
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
			</div>

			<div class="space-y-6">
				<article class="rounded-3xl border border-slate-100/10 bg-white/90 p-6 shadow-2xl shadow-indigo-100">
					<header class="flex items-center justify-between">
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">Diagnóstico cuadrático</p>
							<h2 class="text-lg font-semibold text-slate-900">{rootDescription()}</h2>
						</div>
						<Target class="h-6 w-6 text-indigo-500" />
					</header>
					<div class="mt-6 grid gap-4 sm:grid-cols-2">
						<div class="rounded-2xl border border-slate-100 bg-white p-4">
							<p class="text-xs uppercase tracking-widest text-slate-500">Discriminante</p>
							<p class="mt-1 text-3xl font-semibold text-slate-900">
								{formatNumber(quadratic.discriminant)}
							</p>
							<p class="text-xs text-slate-500">D = b² - 4ac</p>
						</div>
						<div class="rounded-2xl border border-slate-100 bg-white p-4">
							<p class="text-xs uppercase tracking-widest text-slate-500">Vértice</p>
							<p class="mt-1 text-3xl font-semibold text-slate-900">
								({formatNumber(quadratic.vertex.x)}, {formatNumber(quadratic.vertex.y)})
							</p>
							<p class="text-xs text-slate-500">Centro geométrico de la parábola</p>
						</div>
					</div>
					<div class="mt-4 grid gap-4 sm:grid-cols-2">
						<div class="rounded-2xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-4">
							<p class="text-xs uppercase tracking-widest text-slate-500">Raíz 1</p>
							<p class="mt-1 text-2xl font-semibold text-slate-900">
								{formatRoot(quadratic.roots[0] ?? { real: NaN })}
							</p>
						</div>
						<div class="rounded-2xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-4">
							<p class="text-xs uppercase tracking-widest text-slate-500">Raíz 2</p>
							<p class="mt-1 text-2xl font-semibold text-slate-900">
								{formatRoot(quadratic.roots[1] ?? { real: NaN })}
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

				<article class="rounded-3xl border border-slate-100/10 bg-white/90 p-6 shadow-2xl shadow-emerald-100">
					<header class="flex items-center justify-between">
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">Estatus secante</p>
							<h2 class="text-lg font-semibold text-slate-900">{secantPresentation.label}</h2>
						</div>
						<span class={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", toneClasses[secantBadgeTone])}>
							<svelte:component this={BadgeIcon} class="h-4 w-4" />
							{secantPresentation.label}
						</span>
					</header>
					<p class="mt-3 text-sm text-slate-600">{secantResult.reason}</p>
					<div class="mt-5 grid gap-4 sm:grid-cols-3">
						<div class="rounded-2xl border border-slate-100 bg-white p-4">
							<p class="text-xs uppercase tracking-widest text-slate-500">Aproximación</p>
							<p class="mt-1 text-2xl font-semibold text-slate-900">
								{formatNumber(secantResult.approx ?? NaN)}
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
								{selectedIteration ? formatPercent(selectedIteration.error) : "—"}
							</p>
							<p class="text-xs text-slate-500">Relativo |xₙ₊₁ - xₙ|</p>
						</div>
					</div>
				</article>
			</div>
		</section>

		<section class="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
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
					{#each secantControls as control}
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
									on:input={(event) => updateSecantValue(control.key, event.currentTarget.value)}
								/>
								{#if control.key !== "maxIterations"}
									<input
										type="range"
										class="mt-3 w-full accent-indigo-500"
										min={control.min}
										max={control.max}
										step={control.step}
										value={secantConfig[control.key]}
										on:input={(event) => updateSecantValue(control.key, event.currentTarget.value)}
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

			<div class="space-y-6">
				<article class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-2xl shadow-indigo-100">
					<header class="flex items-center justify-between">
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">Visualización interactiva</p>
							<h2 class="text-lg font-semibold text-slate-900">f(x) y trayectoria de la secante</h2>
						</div>
						<TrendingUp class="h-6 w-6 text-indigo-500" />
					</header>
					<div class="mt-4 h-[420px] w-full">
						<LineChart
							data={polynomialSeries}
							x={(point) => point.x}
							y={(point) => point.y}
							series={chartSeries}
							legend
							points
							props={{
								points: { class: "fill-background stroke-slate-400", size: 4 },
								highlight: { points: { size: 8 } }
							}}
						>
							<svelte:fragment slot="aboveMarks" let:xScale let:yScale>
								{#if selectedPoint}
									<g class="pointer-events-none">
										<circle
											cx={xScale(selectedPoint.x)}
											cy={yScale(selectedPoint.y)}
											r="7"
											class="fill-transparent stroke-[3px] stroke-chart-3 opacity-80"
										/>
									</g>
								{/if}
							</svelte:fragment>
						</LineChart>
					</div>
				</article>

				<article class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-2xl shadow-emerald-100">
					<header class="flex items-center justify-between">
						<div>
							<p class="text-xs uppercase tracking-widest text-slate-500">Secante paso a paso</p>
							<h2 class="text-lg font-semibold text-slate-900">Controla cada iteración</h2>
						</div>
						<div class="flex gap-2">
							<button
								class="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
								on:click={goPrevious}
								disabled={selectedIterationIndex === 0 || totalIterations === 0}
							>
								<ChevronLeft class="h-4 w-4" />
							</button>
							<button
								class="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
								on:click={goNext}
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
											<p class="text-2xl font-semibold text-slate-900">{formatNumber(selectedIteration.xCurr)}</p>
										</div>
										<div>
											<p class="text-xs uppercase tracking-widest text-slate-500">xₙ₊₁</p>
											<p class="text-2xl font-semibold text-slate-900">{formatNumber(selectedIteration.xNext)}</p>
										</div>
										<div>
											<p class="text-xs uppercase tracking-widest text-slate-500">f(xₙ₊₁)</p>
											<p class="text-2xl font-semibold text-slate-900">{formatNumber(selectedIteration.fNext)}</p>
										</div>
										<div>
											<p class="text-xs uppercase tracking-widest text-slate-500">Error relativo</p>
											<p class="text-2xl font-semibold text-emerald-600">{formatPercent(selectedIteration.error)}</p>
										</div>
									</div>
									<p class="mt-4 text-sm text-slate-500">
										Δ absoluto |xₙ₊₁ - xₙ| = {formatNumber(iterationDelta(selectedIteration))}
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
										<p class="text-lg font-semibold text-slate-900">x = {formatNumber(iter.xNext)}</p>
										<p class="text-xs text-slate-500">Error {formatPercent(iter.error)}</p>
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
			</div>
		</section>

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
									<td class="py-3 pr-4">{formatNumber(iteration.xPrev)}</td>
									<td class="py-3 pr-4">{formatNumber(iteration.xCurr)}</td>
									<td class="py-3 pr-4">{formatNumber(iteration.fPrev)}</td>
									<td class="py-3 pr-4">{formatNumber(iteration.fCurr)}</td>
									<td class="py-3 pr-4 font-semibold text-slate-900">
										{formatNumber(iteration.xNext)}
									</td>
									<td class="py-3 pr-4">{formatNumber(iteration.fNext)}</td>
									<td class="py-3 pr-4 text-emerald-600">{formatPercent(iteration.error)}</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</section>

		<section class="grid gap-4">
			{#each detailItems as item}
				<details class="rounded-3xl border border-slate-100/10 bg-white/90 px-6 py-4 shadow-sm shadow-slate-200" open>
					<summary class="cursor-pointer text-lg font-semibold text-slate-900">{item.title}</summary>
					<p class="mt-2 text-sm text-slate-600">{item.body}</p>
				</details>
			{/each}
		</section>
	</main>
</div>
