import { object, string } from "zod";
import { Database } from "./db";

export const hello = "hello";

const db = Database.create("test")
	.version(1, {
		User: Database.ModelBuilder()
			.parser(object({ id: string(), name: string() }).parse)
			.key({ keyPath: "id" })
			.index({ field: "name", options: { unique: true } })
			.build(),
	})
	.version(
		2,
		{
			User: Database.ModelBuilder()
				.parser(object({ id: string() }).parse)
				.key({ keyPath: "id" })
				.build(),
		},
		(tx) => {
			tx.objectStore("User").add({ id: "123" });
		},
	)
	.version(
		3,
		{
			User: Database.ModelBuilder()
				.parser(object({ id: string(), name: string() }).parse)
				.key({ keyPath: "id" })
				.index({ field: "name", options: { unique: true } })
				.build(),
		},
		(tx, done) => {
			const store = tx.objectStore("User");
			const cursorRequest = store.openCursor();

			cursorRequest.onsuccess = (e) => {
				const cursor = cursorRequest.result;
				if (!cursor) {
					return done();
				}
				const updatedValue = { ...cursor.value, name: cursor.value.id };
				const updateRequest = cursor.update(updatedValue);

				updateRequest.onsuccess = () => {
					cursor.continue();
				};

				updateRequest.onerror = (err) => {
					console.error("Update failed", err);
					cursor.continue();
				};
			};
		},
	)
	.build();
