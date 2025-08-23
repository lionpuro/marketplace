import type { InferSelectModel } from "drizzle-orm";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import type * as schema from "./database/schema.js";
import type { repository } from "./repository/index.js";

export type User = InferSelectModel<typeof schema.users>;

export type Database = SqliteRemoteDatabase<typeof schema>;

export type Repository = typeof repository;

export type AuthUser = {
	id: string;
	email: string;
	email_verified: boolean;
};

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
