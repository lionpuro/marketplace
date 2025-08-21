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
