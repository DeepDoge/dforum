import { html } from "master-ts/library/template/tags/html"

export function PaperPlaneSvg() {
	return html`
		<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M23 0l-4.5 16.5-6.097-5.43 5.852-6.175-7.844 5.421-5.411-1.316 18-9zm-11 12.501v5.499l2.193-3.323-2.193-2.176zm-2.789 3.857l.94.934c-.875.885-1.773 1.933-2.125 3.375l-1.286-.314c.434-1.774 1.491-3.004 2.471-3.995zm-1.565 7.642c-.715 0-1.353-.279-1.887-.83-1.458.515-2.844-.044-3.576-1.084-.575-.817-.703-1.853-.353-2.845-.552-.534-.83-1.166-.83-1.884 0-1.562 1.16-2.803 3.24-2.586l.195 1.117c-.664.062-1.277.097-1.674.494-.668.668-.467 2.063.787 2.433-.832.836-.751 2.037-.127 2.696.654.69 1.903.799 2.765-.059.385 1.305 1.798 1.422 2.433.787.392-.392.431-.995.492-1.649l1.125.229c.2 1.979-1.009 3.181-2.59 3.181zm-3.318-7.032l.314 1.287c1.755-.43 2.953-1.45 3.989-2.471l-.938-.931c-.876.866-1.927 1.764-3.365 2.115z" />
		</svg>
	`[0] as SVGElement
}
