/**
 * LaTeX Builder - Single Responsibility Principle
 * Handles LaTeX formula generation
 */

import type { QuadraticCoefficients } from "$lib/math";

export class LatexBuilder {
	buildPolynomialLatex({ a, b, c }: QuadraticCoefficients): string {
		const termA = `${this.formatLatexNumber(a)}x^{2}`;
		const termB = `${b >= 0 ? "+" : "-"}\\,${this.formatLatexNumber(Math.abs(b))}x`;
		const termC = `${c >= 0 ? "+" : "-"}\\,${this.formatLatexNumber(Math.abs(c))}`;
		return `\\displaystyle f(x) = ${termA} ${termB} ${termC}`;
	}

	private formatLatexNumber(value: number): string {
		if (!Number.isFinite(value)) return "0";
		return value.toFixed(3);
	}

	getGeneralFormula(): string {
		return "\\displaystyle x = \\frac{-b \\pm \\sqrt{b^{2}-4ac}}{2a}";
	}

	getSecantFormula(): string {
		return "\\displaystyle x_{n+1} = x_n - f(x_n) \\cdot \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}";
	}
}

export const latexBuilder = new LatexBuilder();
