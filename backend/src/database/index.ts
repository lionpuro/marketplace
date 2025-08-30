import { drizzle } from "drizzle-orm/node-postgres";

function newDatabase() {
	const { POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
		process.env;
	const url = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}`;
	const db = drizzle(url);
	return db;
}

export const db = newDatabase();
