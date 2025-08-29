import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import type * as schema from "./database/schema.js";
import type { repository } from "./repository/index.js";
import type { Static } from "@sinclair/typebox";
import type {
	ListingSchema,
	ListingsParamsSchema,
	ListingsSortOption,
	NewListingBodySchema,
	UpdateListingBodySchema,
} from "./schemas/listing.js";

export type Repository = typeof repository;

export type AuthUser = {
	id: string;
	email: string;
	email_verified: boolean;
};

export type Database = SqliteRemoteDatabase<typeof schema>;

export type User = InferSelectModel<typeof schema.users>;

export type ListingsTable = InferSelectModel<typeof schema.listings>;

export type Listing = Static<typeof ListingSchema>;

export type NewListing = Omit<
	InferInsertModel<typeof schema.listings>,
	"id" | "deleted_at" | "created_at" | "updated_at"
>;

export type NewListingBody = Static<typeof NewListingBodySchema>;

export type ListingUpdate = Omit<
	InferInsertModel<typeof schema.listings>,
	"id" | "seller_id" | "deleted_at" | "created_at" | "updated_at"
>;

export type UpdateListingBody = Static<typeof UpdateListingBodySchema>;

export type ListingsParams = Static<typeof ListingsParamsSchema>;

export type ListingsSortOption = Static<typeof ListingsSortOption>;

export type Category = InferSelectModel<typeof schema.categories>;

export type ParentCategory = Category & { subcategories: Category[] };

export type Country = {
	id: number;
	name: string;
	iso2: string;
	emoji: string;
};

export type State = {
	id: number;
	name: string;
	country_id: number;
	country_code: string;
	iso2: string;
	iso3166_2: string;
	type: string;
};

export type City = {
	id: number;
	name: string;
	state_id: number;
	state_code: string;
	country_id: number;
	country_code: string;
};
