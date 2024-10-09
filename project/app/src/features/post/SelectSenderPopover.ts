import { awaited, tags } from "purify-js";
import { Config, currentConfig } from "~/features/config/state";

const { div, button, ul, li } = tags;

export type SelectedSender = {
	network: Config.Network;
	key: string;
};

export function SelectSenderPopover(params: { onChange: (selectedSender: SelectedSender) => unknown }) {
	return div()
		.popover("auto")
		.children(
			"Select Sender",
			ul().children(currentConfig.derive((config) => awaited(config.then(renderOptions), "Loading..."))),
		);

	function renderOptions(config: Config) {
		return Object.values(config.networks).map((network) =>
			li().children(
				network.name,
				ul().children(
					Object.entries(network.contracts.KnochiSenders).map(([key, address]) => {
						return li().children(
							button()
								.type("button")
								.ariaDescription("Sender Option")
								.onclick(() => params.onChange({ network, key }))
								.children(key, address),
						);
					}),
				),
			),
		);
	}
}
