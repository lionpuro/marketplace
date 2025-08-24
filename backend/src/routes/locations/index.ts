import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { locationRepository } from "../../repository/location.js";
import { ISO2Schema } from "../../schemas/location.js";

const ErrorResponseSchema = Type.Object({
	message: Type.String(),
});

const CountrysResponseSchema = Type.Array(
	Type.Object({
		id: Type.Number(),
		name: Type.String(),
		iso2: Type.String(),
		emoji: Type.String(),
	}),
);

const StatesResponseSchema = Type.Array(
	Type.Object({
		id: Type.Number(),
		name: Type.String(),
		country_id: Type.Number(),
		country_code: Type.String(),
		iso2: Type.String(),
		iso3166_2: Type.String(),
		type: Type.String(),
	}),
);

const CitiesResponseSchema = Type.Array(
	Type.Object({
		id: Type.Number(),
		name: Type.String(),
		country_id: Type.Number(),
		country_code: Type.String(),
		state_id: Type.Number(),
		state_code: Type.String(),
	}),
);

const routes: FastifyPluginAsyncTypebox = async (server) => {
	server.route({
		method: "GET",
		url: "/countries",
		schema: {
			response: {
				200: CountrysResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, res) => {
			try {
				const countries = await locationRepository.getCountries();
				return res.code(200).send(countries);
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "GET",
		url: "/countries/:iso_country/states",
		schema: {
			params: Type.Object({
				iso_country: ISO2Schema,
			}),
			response: {
				200: StatesResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, res) => {
			try {
				const country = req.params.iso_country.toUpperCase();
				const states = await locationRepository.getStatesByCountry(country);
				if (!states || states.length === 0) {
					return res.code(200).send([]);
				}
				return res.code(200).send(states);
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "GET",
		url: "/countries/:iso_country/states/:iso_state/cities",
		schema: {
			params: Type.Object({
				iso_country: ISO2Schema,
				iso_state: ISO2Schema,
			}),
			response: {
				200: CitiesResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, res) => {
			try {
				const country = req.params.iso_country.toUpperCase();
				const state = req.params.iso_state.toUpperCase();
				const cities = await locationRepository.getCitiesByState(
					country,
					state,
				);
				if (!cities || cities.length === 0) {
					return res.code(200).send([]);
				}
				return res.code(200).send(cities);
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
};
export default routes;
