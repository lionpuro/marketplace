import { eq } from "drizzle-orm";
import { db } from "../database/index.js";
import * as schema from "../database/schema.js";
import type { User } from "../types.js";

export async function createUser(user: User): Promise<void> {
	await db.insert(schema.users).values(user).onConflictDoNothing();
}

export async function updateUser(user: User): Promise<void> {
	await db
		.update(schema.users)
		.set({ name: user.name, email: user.email })
		.where(eq(schema.users.id, user.id));
}

export async function upsertUser(user: User): Promise<void> {
	await db
		.insert(schema.users)
		.values(user)
		.onConflictDoUpdate({
			target: schema.users.id,
			set: { name: user.name, email: user.email },
		});
}

export async function deleteUser(id: string): Promise<User | undefined> {
	const [result] = await db
		.delete(schema.users)
		.where(eq(schema.users.id, id))
		.returning();
	return result;
}
