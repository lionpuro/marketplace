import { Type } from "@sinclair/typebox";
import { Nullable } from "./index.js";

export const ISO2Schema = Type.String({
	minLength: 1,
	maxLength: 3,
});

export const CountrySchema = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	iso2: Nullable(Type.String()),
	emoji: Nullable(Type.String()),
});

export const StateSchema = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	country_id: Type.Number(),
	country_code: Type.String(),
	iso2: Nullable(Type.String()),
	iso3166_2: Nullable(Type.String()),
	type: Nullable(Type.String()),
});

export const CitySchema = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	country_id: Type.Number(),
	country_code: Type.String(),
	state_id: Type.Number(),
	state_code: Type.String(),
});
