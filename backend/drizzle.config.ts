import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/database/schema",
	out: "./drizzle/migrations",
	dbCredentials: {
		user: process.env.POSTGRES_USER!,
		password: process.env.POSTGRES_PASSWORD!,
		database: process.env.POSTGRES_DB!,
		host: "localhost",
		port: Number(process.env.POSTGRES_PORT!),
		ssl: false,
	},
});
