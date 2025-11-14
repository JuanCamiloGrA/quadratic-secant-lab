<script lang="ts">
	import type { ChartSeries, ChartPoint } from "$lib/domain/chart-data-builder";
	import { onMount, onDestroy } from "svelte";
	import Plotly from "plotly.js-basic-dist-min";
	import TrendingUp from "lucide-svelte/icons/trending-up";
	import { formatters } from "$lib/formatters";

	export let polynomialSeries: ChartPoint[];
	export let chartSeries: ChartSeries[];
	export let selectedPoint: ChartPoint | null;

	let chartDiv: HTMLDivElement;
	let isReady = false;

	// Reactive statement to update chart when data changes
	$: if (isReady && chartDiv) {
		updateChart();
	}

	function updateChart() {
		const traces: any[] = [];

		// Trace 1: Función polinomial
		traces.push({
			x: polynomialSeries.map((p) => p.x),
			y: polynomialSeries.map((p) => p.y),
			type: "scatter",
			mode: "lines",
			name: "f(x) - Función cuadrática",
			line: {
				color: "rgb(99, 102, 241)",
				width: 3
			},
			hovertemplate: "<b>Función f(x)</b><br>x: %{x:.6f}<br>f(x): %{y:.6f}<extra></extra>"
		});

		// Traces adicionales de chartSeries (iteraciones de secante)
		chartSeries.forEach((series) => {
			if (series.key !== "polynomial" && series.data.length > 0) {
				traces.push({
					x: series.data.map((p) => p.x),
					y: series.data.map((p) => p.y),
					type: "scatter",
					mode: "lines+markers",
					name: "Iteraciones del método",
					line: {
						color: "rgb(239, 68, 68)",
						width: 2,
						dash: "dot"
					},
					marker: {
						size: 8,
						color: "rgb(239, 68, 68)",
						line: {
							color: "white",
							width: 2
						}
					},
					hovertemplate: "<b>Iteración</b><br>x: %{x:.6f}<br>f(x): %{y:.6f}<extra></extra>"
				});
			}
		});

		// Trace para el punto seleccionado
		if (selectedPoint) {
			traces.push({
				x: [selectedPoint.x],
				y: [selectedPoint.y],
				type: "scatter",
				mode: "markers",
				name: "Punto seleccionado",
				marker: {
					size: 16,
					color: "rgb(16, 185, 129)",
					line: {
						color: "white",
						width: 3
					},
					symbol: "circle"
				},
				hovertemplate:
					"<b>Punto Seleccionado</b><br>x: %{x:.6f}<br>f(x): %{y:.6f}<extra></extra>"
			});
		}

		const layout = {
			paper_bgcolor: "rgba(255,255,255,0)",
			plot_bgcolor: "rgba(255,255,255,1)",
			margin: { l: 70, r: 40, t: 40, b: 60 },
			xaxis: {
				title: {
					text: "<b>x</b>",
					font: { size: 16, color: "rgb(51, 65, 85)", family: "Inter, system-ui, sans-serif" }
				},
				gridcolor: "rgb(226, 232, 240)",
				gridwidth: 1,
				zeroline: true,
				zerolinecolor: "rgb(100, 116, 139)",
				zerolinewidth: 3,
				showline: true,
				linecolor: "rgb(148, 163, 184)",
				linewidth: 2,
				tickfont: { size: 12, color: "rgb(71, 85, 105)" },
				tickformat: ".4f"
			},
			yaxis: {
				title: {
					text: "<b>f(x)</b>",
					font: { size: 16, color: "rgb(51, 65, 85)", family: "Inter, system-ui, sans-serif" }
				},
				gridcolor: "rgb(226, 232, 240)",
				gridwidth: 1,
				zeroline: true,
				zerolinecolor: "rgb(100, 116, 139)",
				zerolinewidth: 3,
				showline: true,
				linecolor: "rgb(148, 163, 184)",
				linewidth: 2,
				tickfont: { size: 12, color: "rgb(71, 85, 105)" },
				tickformat: ".4f"
			},
			hovermode: "closest",
			showlegend: true,
			legend: {
				x: 0.02,
				y: 0.98,
				xanchor: "left",
				yanchor: "top",
				bgcolor: "rgba(255, 255, 255, 0.95)",
				bordercolor: "rgb(226, 232, 240)",
				borderwidth: 1,
				font: { size: 11, family: "Inter, system-ui, sans-serif" }
			},
			font: {
				family: "Inter, system-ui, sans-serif",
				color: "rgb(51, 65, 85)"
			}
		};

		const config = {
			responsive: true,
			displayModeBar: true,
			displaylogo: false,
			modeBarButtonsToRemove: ["lasso2d", "select2d"],
			modeBarButtonsToAdd: [
				{
					name: "Restablecer vista",
					icon: Plotly.Icons.home,
					click: () => Plotly.relayout(chartDiv, { "xaxis.autorange": true, "yaxis.autorange": true })
				}
			],
			locale: "es",
			toImageButtonOptions: {
				format: "png",
				filename: "grafico_metodo_secante",
				height: 600,
				width: 1000,
				scale: 2
			}
		};

		Plotly.react(chartDiv, traces, layout, config);
	}

	onMount(() => {
		isReady = true;
		updateChart();
	});

	onDestroy(() => {
		if (chartDiv) {
			Plotly.purge(chartDiv);
		}
	});
</script>

<article class="rounded-3xl border border-slate-100/10 bg-white p-6 shadow-2xl shadow-indigo-100">
	<header class="flex items-center justify-between">
		<div>
			<p class="text-xs uppercase tracking-widest text-slate-500">Plano Cartesiano Interactivo</p>
			<h2 class="text-lg font-semibold text-slate-900">Función Polinomial y Método de la Secante</h2>
		</div>
		<TrendingUp class="h-6 w-6 text-indigo-500" />
	</header>

	<div class="mt-4 h-[520px] w-full" bind:this={chartDiv}></div>

	<!-- Leyenda educativa adicional -->
	<div class="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full bg-indigo-500"></div>
			<span class="text-xs text-slate-600">Función cuadrática f(x)</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full bg-red-500"></div>
			<span class="text-xs text-slate-600">Iteraciones del método</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full bg-emerald-500"></div>
			<span class="text-xs text-slate-600">Punto seleccionado actual</span>
		</div>
		<div class="flex items-center gap-2">
			<svg class="h-3 w-8" viewBox="0 0 32 12">
				<line x1="0" y1="6" x2="32" y2="6" stroke="rgb(100, 116, 139)" stroke-width="3" />
			</svg>
			<span class="text-xs text-slate-600">Ejes cartesianos (x=0, y=0)</span>
		</div>
	</div>

	<!-- Instrucciones de uso -->
	<div class="mt-3 rounded-xl bg-slate-50 px-4 py-3">
		<p class="text-xs font-medium text-slate-700 mb-1">💡 Herramientas interactivas:</p>
		<ul class="text-xs text-slate-600 space-y-0.5 ml-4">
			<li>• <strong>Zoom:</strong> Arrastre para seleccionar área o use la rueda del ratón</li>
			<li>• <strong>Pan:</strong> Mantenga y arrastre para desplazar la vista</li>
			<li>• <strong>Restablecer:</strong> Doble clic o botón de inicio en la barra de herramientas</li>
			<li>• <strong>Exportar:</strong> Descargue la imagen usando el botón de cámara</li>
		</ul>
	</div>
</article>
