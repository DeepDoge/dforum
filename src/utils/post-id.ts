import { ethers } from "ethers"
import type { _ } from "@/utils/_"

export type PostId = string & { [_]: "PostId" }
export function PostId(postId: string): PostId {
	return postId as PostId
}
export function postIdFromHex(postIdHex: string): PostId {
	return ethers.encodeBase58(postIdHex) as PostId
}

export function postIdToHex(postId: PostId): string {
	return ethers.toBeHex(ethers.decodeBase58(postId))
}
