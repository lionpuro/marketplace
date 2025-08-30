import { and, asc, desc, eq, SQL } from "drizzle-orm";
import { db } from "../database/index.js";
import * as s from "../database/schema.js";
import type {
	Listing,
	ListingsParams,
	ListingUpdate,
	NewListing,
} from "../types.js";
import { aliasColumn } from "../database/helper.js";

export async function findListings(params: ListingsParams): Promise<Listing[]> {
	const orderBy: SQL[] = [];
	if (params.sort) {
		const [sort, order] = params.sort.split("|");
		if (
			(sort === "price" || sort === "date") &&
			(order === "asc" || order === "desc")
		) {
			const column =
				sort === "price" ? s.listings.price : s.listings.created_at;
			const orderFn = order === "asc" ? asc : desc;
			orderBy.push(orderFn(column));
		}
	}
	const {
		id,
		seller_id,
		title,
		description,
		price,
		country_code,
		state_code,
		city,
		created_at,
		updated_at,
	} = s.listings;
	const rows = await db
		.select({
			id,
			seller_id,
			title,
			description,
			price,
			country_code,
			state_code,
			city,
			created_at,
			updated_at,
			category: {
				id: aliasColumn(s.categories.id, "c_id"),
				name: aliasColumn(s.categories.name, "c_name"),
				parent_id: aliasColumn(s.categories.parent_id, "c_parent_id"),
			},
		})
		.from(s.listings)
		.innerJoin(s.categories, eq(s.listings.category_id, s.categories.id))
		.where(
			and(
				params.seller ? eq(s.listings.seller_id, params.seller) : undefined,
				params.category
					? eq(s.listings.category_id, params.category)
					: undefined,
				params.country
					? eq(s.listings.country_code, params.country)
					: undefined,
				params.country && params.state
					? eq(s.listings.state_code, params.state)
					: undefined,
				params.city ? eq(s.listings.city, params.city) : undefined,
			),
		)
		.orderBy(...orderBy);
	return rows;
}

export async function findListing(
	listingID: number,
): Promise<Listing | undefined> {
	const {
		id,
		seller_id,
		title,
		description,
		price,
		country_code,
		state_code,
		city,
		created_at,
		updated_at,
	} = s.listings;
	const [row] = await db
		.select({
			id,
			seller_id,
			title,
			description,
			price,
			country_code,
			state_code,
			city,
			created_at,
			updated_at,
			category: {
				id: aliasColumn(s.categories.id, "c_id"),
				name: aliasColumn(s.categories.name, "c_name"),
				parent_id: aliasColumn(s.categories.parent_id, "c_parent_id"),
			},
		})
		.from(s.listings)
		.innerJoin(s.categories, eq(s.listings.category_id, s.categories.id))
		.where(eq(s.listings.id, listingID));
	return row;
}

export async function createListing(listing: NewListing) {
	await db.insert(s.listings).values(listing);
}

export async function updateListing(
	id: number,
	uid: string,
	listing: ListingUpdate,
) {
	const [result] = await db
		.update(s.listings)
		.set({ ...listing })
		.where(and(eq(s.listings.id, id), eq(s.listings.seller_id, uid)))
		.returning({ id: s.listings.id });
	return result;
}

export async function deleteListing(
	uid: string,
	id: number,
): Promise<{ deleted_id: number } | void> {
	const [result] = await db
		.delete(s.listings)
		.where(and(eq(s.listings.id, id), eq(s.listings.seller_id, uid)))
		.returning({ deleted_id: s.listings.id });
	return result;
}
