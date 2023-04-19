import { Copy2Svg } from "@/assets/svgs/copy2"
import type { Address } from "@/utils/address"
import { defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"

const WalletAddressComponent = defineComponent("x-wallet-address")
export function WalletAddress(address: Address) {
	const component = new WalletAddressComponent()

	component.$html = html`
		<button
			on:click=${(e) => (e.preventDefault(), navigator.clipboard.writeText(address).then(() => alert(`Address copied to clipboard\nTODO: Add toast notifactions etc..`)))}
			title=${address}
			aria-label="wallet address, click to copy"
		>
			<x ${Copy2Svg()} aria-hidden></x>
			<span>${address.substring(0, address.length - 4)}</span><span>${address.substring(address.length - 4)}</span>
		</button>
	`

	return component
}
WalletAddressComponent.$css = css`
	:host {
		display: contents;
	}

	button {
		all: unset;
		font: inherit;
		cursor: pointer;

        background-color: transparent;

        transition: var(--transition);
        transition-property: background-color;

		&:hover {
			background-color: hsl(var(--base-text-hsl), 10%)
		}

        &:active {
			background-color: hsl(var(--base-text-hsl), 20%)
		}
	}

	button {
		display: inline-grid;
		grid-template-areas: "address-start address-end . svg";
		grid-template-columns: 1fr auto .5ch 1em;
		align-items: center;
		max-width: 20ch;
		color: inherit;

		& > svg {
			grid-area: svg;
		}

		& > span:nth-child(1 of span) {
			grid-area: address-start;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		& > span:nth-child(2 of span) {
			grid-area: address-end;
		}
	}
`
