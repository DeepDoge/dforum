import { html } from "~/shared/html";

export function TrashcanSvg() {
	return html`
		<svg
			width="100%"
			viewBox="0 0 512 512"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink">
			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g fill="currentColor" transform="translate(64.000000, 42.666667)">
					<path
						d="M256,42.6666667 L128,42.6666667 L128,7.10542736e-15 L256,7.10542736e-15 L256,42.6666667 Z M170.666667,170.666667 L128,170.666667 L128,341.333333 L170.666667,341.333333 L170.666667,170.666667 Z M256,170.666667 L213.333333,170.666667 L213.333333,341.333333 L256,341.333333 L256,170.666667 Z M384,85.3333333 L384,128 L341.333333,128 L341.333333,426.666667 L42.6666667,426.666667 L42.6666667,128 L0,128 L0,85.3333333 L384,85.3333333 Z"></path>
				</g>
			</g>
		</svg>
	`.firstElementChild as SVGSVGElement;
}
