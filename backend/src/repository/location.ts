import { newLocationDatabase } from "../database/location/index.js";
import type { Country, State, City } from "../types.js";

export async function newLocationRepository() {
	const db = await newLocationDatabase();
	const repository = {
		getCountries: async () => {
			const rows = db
				.prepare("SELECT id, name, iso2, emoji FROM countries")
				.all();
			return rows as Country[];
		},
		getStatesByCountry: async (code: string) => {
			const sql = `
			SELECT
				id,
				name,
				country_id,
				country_code,
				iso2,
				iso3166_2,
				type
			FROM states WHERE country_code = ?`;
			const rows = db.prepare(sql).all(code);
			return rows as State[];
		},
		getCitiesByState: async (country: string, state: string) => {
			const sql = `
			SELECT
				id,
				name,
				state_id,
				state_code,
				country_id,
				country_code
			FROM cities
			WHERE country_code = ? AND state_code = ?`;
			const rows = db.prepare(sql).all(country, state);
			return rows as City[];
		},
	};
	return repository;
}

export const locationRepository = await newLocationRepository();
