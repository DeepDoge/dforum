import { connect_EternisPostDB, EternisPostDB_Contract } from "@/contracts/artifacts/EternisPostDB"
import { Address } from "@/utils/address"
import { ethers } from "ethers"
import { $ } from "master-ts/library/$"
import { networkConfigs } from "../networks"

const ethereum = (window as any).ethereum
export namespace walletApi {
	export type WalletState = "wrong-network" | "not-connected" | "connected"

	const browserProvider = new ethers.BrowserProvider(ethereum, "any")
	browserProvider.listAccounts().then((accounts) => {
		const isConnected = accounts.length > 0
		if (isConnected) connectWallet()
	})

	ethereum.on("accountsChanged", () => location.reload())
	ethereum.on("chainChanged", () => location.reload())

	const browserWalletStateWritable = $.writable<WalletState>("not-connected")
	const browserWalletWritable = $.writable<{
		signer: ethers.JsonRpcSigner
		provider: ethers.BrowserProvider
		address: Address
		contracts: {
			EternisPostDB: EternisPostDB_Contract
		}
	} | null>(null)
	export const browserWallet = $.derive(() => browserWalletWritable.ref)
	export const browserWalletState = $.derive(() => browserWalletStateWritable.ref)

	export async function connectWallet() {
		await browserProvider.send("eth_requestAccounts", [])
		const signer = await browserProvider.getSigner()

		const chainKey = networkConfigs.chainIdToKeyMap.get((await browserProvider.getNetwork()).chainId)
		if (!chainKey) {
			browserWalletStateWritable.ref = "wrong-network"
			browserWalletWritable.ref = null
			throw new Error(`Chain key for ${chainKey} cannot be found`)
		}

		browserWalletWritable.ref = {
			signer,
			provider: browserProvider,
			address: Address(await signer.getAddress()),
			contracts: {
				EternisPostDB: connect_EternisPostDB(networkConfigs.contracts[chainKey].EternisPostDB, signer),
			},
		}
		browserWalletStateWritable.ref = "connected"
	}

	export async function changeChain(chainKey: networkConfigs.ChainKey) {
		const chainConfig = networkConfigs.chains[chainKey]
		const providerConfig = networkConfigs.rpcProviders[chainKey]
		if (!browserWallet.ref) return
		try {
			await browserWallet.ref.provider.send("wallet_switchEthereumChain", [{ chainId: ethers.toBeHex(chainConfig.id) }])
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

				await browserWallet.ref.provider.send("wallet_addEthereumChain", [config])
			} else throw err
		}
	}
}
