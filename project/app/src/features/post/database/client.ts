import { bigint, number, object, string } from "zod";
import { Feed } from "~/features/post/lib/Feed";
import { DB } from "~/lib/db/mod";
import { Address, Hex } from "~/lib/solidity/primatives";

const indexedDbVersionKey = "indexed-db-version:knochi.posts";
const version = "1";
if (localStorage.getItem(indexedDbVersionKey) !== version) {
	await DB.IDB.toPromise(indexedDB.deleteDatabase("knochi.posts"));
	localStorage.setItem(indexedDbVersionKey, version);
}

export const postDb = DB.create("knochi.posts")
	.version(1, {
		FeedGroup: DB.ModelBuilder()
			.parser(
				object({
					groupId: string(),
					name: string(),
					index: number(),
				}).parse,
			)
			.key({ keyPath: ["groupId"] })
			.index({ field: "index", options: {} })
			.build(),
		FeedGroupItem: DB.ModelBuilder()
			.parser(
				object({
					groupId: string(),
					feedId: Feed.Id(),
					label: string(),
					address: Address().optional(),
				}).parse,
			)
			.key({ keyPath: ["groupId", "feedId"] })
			.index({ field: "groupId", options: {} })
			.build(),
		Feed: DB.ModelBuilder()
			.parser(
				object({
					chainIdHex: Hex(),
					indexerAddress: Address(),
					feedId: Feed.Id(),
					length: bigint(),
				}).strict().parse,
			)
			.key({ keyPath: ["chainIdHex", "indexerAddress", "feedId"] })
			.index({ field: "feedId", options: {} })
			.build(),
		PostIndex: DB.ModelBuilder()
			.parser(
				object({
					chainIdHex: Hex(),
					indexerAddress: Address(),
					feedId: Feed.Id(),
					indexHex: Hex(),
					postIdHex: Hex(),
					storeAddress: Address(),
					authorAddress: Address(),
					time_seconds: bigint(),
				}).strict().parse,
			)
			.key({ keyPath: ["chainIdHex", "indexerAddress", "feedId", "indexHex"] })
			.index({ field: ["chainIdHex", "indexerAddress", "feedId"], options: {} })
			.index({ field: "feedId", options: {} })
			.index({ field: ["storeAddress", "postIdHex"], options: { unique: true } })
			.index({ field: "authorAddress", options: {} })
			.build(),
		Post: DB.ModelBuilder()
			.parser(
				object({
					storeAddress: Address(),
					postIdHex: Hex(),
					content: Hex(),
				}).strict().parse,
			)
			.key({ keyPath: ["storeAddress", "postIdHex"] })
			.build(),
	})
	.build();
