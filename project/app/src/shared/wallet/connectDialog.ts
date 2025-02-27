import { computed } from "@purifyjs/core";
import { config, Config } from "~/shared/config";
import { Router } from "~/shared/router";
import { catchError } from "~/shared/utils/catch";
import { ConnectWalletDialog } from "~/shared/wallet/components/ConnectWalletDialog";

const searchParam = new Router.SearchParam<`${Config.Network.ChainId}` | "open">("connect");
const network = computed<Config.Network | null>(() => {
	const searchParamValue = searchParam.val;
	if (!searchParamValue) return null;

	const { networks } = config.val;

	const chainId = catchError(() => BigInt(searchParamValue), [Error]);
	return chainId.error ? null : (networks[`${chainId.data}`] ?? null);
});

const dialog = ConnectWalletDialog({
	network,
	isOpen: searchParam.derive(Boolean),
	close() {
		searchParam.val = null;
	},
});

export const connectWallet = {
	dialog,
	searchParam,
	network,
} as const;
