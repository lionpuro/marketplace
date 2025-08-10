import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import type { User } from "../types.js";

export async function createUser(user: User): Promise<void> {
	await db.insert(schema.users).values(user).onConflictDoNothing();
}
