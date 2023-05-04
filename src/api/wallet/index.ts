import { connect_EternisPostDB, EternisPostDB_Contract } from "@/contracts/artifacts/EternisPostDB"
import { Address } from "@/utils/address"
import { ethers } from "ethers"
import { $ } from "master-ts/library/$"
import { networkConfigs } from "../networks"

const ethereum = (window as any).ethereum
export namespace walletApi {
	export const WrongNetworkSymbol = Symbol()
	export type WrongNetworkSymbol = typeof WrongNetworkSymbol

	export const NotConnectedSymbol = Symbol()
	export type NotConnectedSymbol = typeof NotConnectedSymbol

	const browserProvider = new ethers.BrowserProvider(ethereum, "any")
	browserProvider.listAccounts().then((accounts) => {
		const isConnected = accounts.length > 0
		if (isConnected) connectWallet()
	})

	ethereum.on("accountsChanged", () => location.reload())
	ethereum.on("chainChanged", () => location.reload())

	const web3WalletWritable = $.writable<
		| {
				signer: ethers.JsonRpcSigner
				provider: ethers.BrowserProvider
				address: Address
				contracts: {
					EternisPostDB: EternisPostDB_Contract
				}
		  }
		| WrongNetworkSymbol
		| NotConnectedSymbol
	>(NotConnectedSymbol)
	export const web3Wallet = $.derive(() => web3WalletWritable.ref)

	export async function connectWallet() {
		await browserProvider.send("eth_requestAccounts", [])
		const signer = await browserProvider.getSigner()

		const chainKey = networkConfigs.chainIdToKeyMap.get((await browserProvider.getNetwork()).chainId)
		if (!chainKey) throw new Error(`Chain key for ${chainKey} cannot be found`)

		web3WalletWritable.ref = chainKey
			? {
					signer,
					provider: browserProvider,
					address: Address(await signer.getAddress()),
					contracts: {
						EternisPostDB: connect_EternisPostDB(networkConfigs.contracts[chainKey].EternisPostDB, signer),
					},
			  }
			: WrongNetworkSymbol
	}

	export async function changeChain(chainKey: networkConfigs.ChainKey) {
		const chainConfig = networkConfigs.chains[chainKey]
		const providerConfig = networkConfigs.rpcProviders[chainKey]
		if (typeof web3Wallet.ref === "object") {
			try {
				await web3Wallet.ref.provider.send("wallet_switchEthereumChain", [{ chainId: ethers.toBeHex(chainConfig.id) }])
			} catch (err) {
				// This error code indicates that the chain has not been added to MetaMask
				if (err && typeof err === "object" && "code" in err && err.code === 4902) {
					type JsonRpcProviderConfig = {
						chainName: string
						chainId: string
						nativeCurrency: { name: string; decimals: number; symbol: string }
						rpcUrls: string[]
						blockExplorerUrls: string[]
					}

					const config = {
						chainName: chainConfig.name,
						chainId: ethers.toBeHex(chainConfig.id),
						nativeCurrency: chainConfig.currency,
						blockExplorerUrls: [providerConfig.blockExplorer.href],
						rpcUrls: [providerConfig.rpc.href],
					} satisfies JsonRpcProviderConfig

					await web3Wallet.ref.provider.send("wallet_addEthereumChain", [config])
				} else throw err
			}
		}
	}
}
