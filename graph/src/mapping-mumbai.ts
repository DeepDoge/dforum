import { Bytes } from "@graphprotocol/graph-ts"
import { EternisTransaction } from "../generated/IEternis/IEternis"
import { handlePost } from "./post-db"

const chainId = Bytes.fromHexString("0x013881")

export function map(event: EternisTransaction): void {
	handlePost(chainId, event)
}
