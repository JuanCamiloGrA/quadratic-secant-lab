/**
 * Content Configuration - Open/Closed Principle
 * Static content for the UI
 */

export interface DetailItem {
	title: string;
	body: string;
}

export const detailItems: DetailItem[] = [
	{
		title: "¿Por qué Fórmula cuadrática?",
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
