/**
 * Formatters module - Single Responsibility Principle
 * Handles all number and text formatting logic
 */

export class NumberFormatters {
	private readonly esLocale = "es-ES";
	
	private readonly standardFormatter: Intl.NumberFormat;
	private readonly compactFormatter: Intl.NumberFormat;
	private readonly scientificFormatter: Intl.NumberFormat;

	constructor() {
		this.standardFormatter = new Intl.NumberFormat(this.esLocale, { maximumFractionDigits: 6 });
		this.compactFormatter = new Intl.NumberFormat(this.esLocale, { maximumFractionDigits: 3 });
		this.scientificFormatter = new Intl.NumberFormat(this.esLocale, {
			notation: "scientific",
			maximumFractionDigits: 2
		});
	}

	formatNumber(value: number, digits = 6): string {
		if (!Number.isFinite(value)) return "—";
		const formatter = new Intl.NumberFormat(this.esLocale, { maximumFractionDigits: digits });
		return formatter.format(value);
	}

	formatPercent(value: number): string {
		if (!Number.isFinite(value)) return "—";
		return `${(value * 100).toFixed(4)} %`;
	}

	formatScientific(value: number): string {
		if (!Number.isFinite(value)) return "—";
		return this.scientificFormatter.format(value);
	}

	formatLatexNumber(value: number): string {
		if (!Number.isFinite(value)) return "0";
		return value.toFixed(3);
	}

	formatRoot(value: { real: number; imag?: number }): string {
		const hasImag = value.imag && Math.abs(value.imag) > 1e-9;
		if (hasImag) {
			const sign = value.imag && value.imag >= 0 ? "+" : "-";
			const imag = value.imag ? Math.abs(value.imag) : 0;
			return `${this.formatNumber(value.real)} ${sign} ${this.formatNumber(imag)}i`;
		}
		return this.formatNumber(value.real);
	}

	toNumber(value: number | string): number {
		const numeric = Number(value);
		return Number.isFinite(numeric) ? numeric : 0;
	}
}

export const formatters = new NumberFormatters();
