<script lang="ts">
	import { runSecant, solveQuadratic, type QuadraticCoefficients } from "$lib/math";
	import { latexBuilder } from "$lib/presentation/latex-builder";
	import { statusPresenter } from "$lib/presentation/status-presenter";
	import { chartDataBuilder } from "$lib/domain/chart-data-builder";
	import { wizardBuilder } from "$lib/domain/wizard-builder";
	import { secantNormalizer } from "$lib/domain/secant-normalizer";
	import { coefficientControls, secantControls, type CoefficientKey, type SecantKey } from "$lib/config/control-definitions";
	import { presets } from "$lib/config/presets";
	import { detailItems } from "$lib/config/content";
	
	// Component imports
	import HeroSection from "$lib/components/sections/HeroSection.svelte";
	import CoefficientControlPanel from "$lib/components/sections/CoefficientControlPanel.svelte";
	import SecantControlPanel from "$lib/components/sections/SecantControlPanel.svelte";
	import QuadraticDiagnosticCard from "$lib/components/sections/QuadraticDiagnosticCard.svelte";
	import SecantStatusCard from "$lib/components/sections/SecantStatusCard.svelte";
	import ChartVisualization from "$lib/components/sections/ChartVisualization.svelte";
	import IterationControl from "$lib/components/sections/IterationControl.svelte";
	import IterationTable from "$lib/components/sections/IterationTable.svelte";

	// State
	let coefficients: QuadraticCoefficients = { a: 1, b: -4, c: 3 };
	let secantConfig: Record<SecantKey, number> = {
		x0: -1,
		x1: 3.2,
		tolerance: 1e-5,
		maxIterations: 18
	};
	let selectedIterationIndex = 0;

	// Formulas (static)
	const generalFormula = latexBuilder.getGeneralFormula();
	const secantFormula = latexBuilder.getSecantFormula();

	// Computed values
	$: normalizedSecant = secantNormalizer.normalize(secantConfig);
	$: quadratic = solveQuadratic(coefficients);
	$: polynomialLatex = latexBuilder.buildPolynomialLatex(coefficients);
	$: secantResult = runSecant(coefficients, normalizedSecant);
	$: iterations = secantResult.iterations;
	$: totalIterations = iterations.length;

	// Ensure selected index stays within bounds
	$: {
		const maxIndex = Math.max(totalIterations - 1, 0);
		if (selectedIterationIndex > maxIndex) {
			selectedIterationIndex = maxIndex;
		}
		if (selectedIterationIndex < 0) {
			selectedIterationIndex = 0;
		}
	}

	// Derived presentation data
	$: selectedIteration = iterations[selectedIterationIndex];
	$: chartDomain = chartDataBuilder.deriveDomain(normalizedSecant, quadratic, iterations);
	$: polynomialSeries = chartDataBuilder.buildPolynomialSeries(coefficients, chartDomain);
	$: secantSeriesPoints = chartDataBuilder.buildSecantPoints(iterations);
	$: chartSeries = chartDataBuilder.buildChartSeries(polynomialSeries, secantSeriesPoints);
	$: highlightedIterations = iterations.slice(0, 3);
	$: wizardSteps = wizardBuilder.buildSteps(normalizedSecant, totalIterations);
	$: selectedPoint = selectedIteration ? { x: selectedIteration.xNext, y: selectedIteration.fNext } : null;
	$: secantPresentation = statusPresenter.getSecantPresentation(secantResult.status);
	$: secantBadgeTone = secantPresentation.tone;
	$: BadgeIcon = statusPresenter.getIconForTone(secantBadgeTone);
	$: toneClasses = statusPresenter.getClassesForTone(secantBadgeTone);
	$: rootDescription = statusPresenter.getQuadraticDescription(quadratic);

	// Event handlers
	function applyPreset(presetIndex: number) {
		const preset = presets[presetIndex];
		coefficients = structuredClone(preset.coefficients);
		secantConfig = structuredClone(preset.secant) as typeof secantConfig;
		selectedIterationIndex = 0;
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
</script>

<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_45%)] py-10">
	<main class="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
		<!-- Hero Section -->
		<HeroSection {generalFormula} {secantFormula} {polynomialLatex} />

		<!-- Sección 1: Fórmula Cuadrática -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold text-slate-900">Fórmula Cuadrática</h2>
			<div class="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
				<div class="space-y-6">
					<CoefficientControlPanel
						{coefficients}
						controls={coefficientControls}
						{presets}
						onUpdate={updateCoefficient}
						onPresetApply={applyPreset}
					/>
				</div>

				<div class="space-y-6">
					<QuadraticDiagnosticCard {quadratic} {rootDescription} />
				</div>
			</div>
		</section>

		<!-- Sección 2: Método de la Secante -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold text-slate-900">Método de la Secante</h2>
			<div class="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
				<div class="space-y-6">
					<SecantControlPanel
						{secantConfig}
						controls={secantControls}
						{wizardSteps}
						onUpdate={updateSecantValue}
					/>

					<SecantStatusCard
						{secantResult}
						{totalIterations}
						{selectedIteration}
						badgeLabel={secantPresentation.label}
						{toneClasses}
						{BadgeIcon}
					/>
				</div>

				<div class="space-y-6">
					<ChartVisualization {polynomialSeries} {chartSeries} {selectedPoint} />

					<IterationControl
						{totalIterations}
						bind:selectedIterationIndex
						{selectedIteration}
						{highlightedIterations}
						onPrevious={goPrevious}
						onNext={goNext}
					/>
				</div>
			</div>
		</section>

		<!-- Tabla de Iteraciones -->
		<IterationTable {iterations} {selectedIteration} />

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
