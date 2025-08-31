import * as s from "../database/schema/index.js";
import { db } from "../database/index.js";
import type { City, Country, State } from "../types.js";
import { and, eq } from "drizzle-orm";

export const locationRepository = {
	getCountries: async (): Promise<Country[]> => {
		const { id, name, iso2, emoji } = s.countries;
		const rows = db.select({ id, name, iso2, emoji }).from(s.countries);
		return rows;
	},
	getStatesByCountry: async (code: string): Promise<State[]> => {
		const { id, name, country_id, country_code, iso2, iso3166_2, type } =
			s.states;
		const rows = db
			.select({ id, name, country_id, country_code, iso2, iso3166_2, type })
			.from(s.states)
			.where(eq(s.states.country_code, code));
		return rows;
	},
	getCitiesByState: async (country: string, state: string): Promise<City[]> => {
		const { id, name, state_id, state_code, country_id, country_code } =
			s.cities;
		const rows = db
			.select({ id, name, state_id, state_code, country_id, country_code })
			.from(s.cities)
			.where(
				and(eq(s.cities.country_code, country), eq(s.cities.state_code, state)),
			);
		return rows;
	},
};
