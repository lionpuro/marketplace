import { db } from "../database/index.js";
import * as s from "../database/schema.js";
import type { Category } from "../types.js";

export async function getCategories(): Promise<Category[]> {
	const result = await db.select().from(s.categories);
	return result;
}
