import SQLite, { type Database } from "better-sqlite3";

export async function newLocationDatabase(): Promise<Database> {
	const filename = "./data/world.sqlite3";
	const db = new SQLite(filename, {
		readonly: true,
		fileMustExist: true,
	});
	return db;
}
