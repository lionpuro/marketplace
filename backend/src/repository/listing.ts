import { db } from "../database/index.js";
import * as s from "../database/schema.js";
import type { NewListing } from "../types.js";

export async function createListing(listing: NewListing) {
	await db.insert(s.listings).values(listing);
}
