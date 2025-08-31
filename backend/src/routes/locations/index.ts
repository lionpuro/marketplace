import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { locationRepository } from "../../repository/location.js";
import {
	CitySchema,
	CountrySchema,
	ISO2Schema,
	StateSchema,
} from "../../schemas/location.js";

const ErrorResponseSchema = Type.Object({
	message: Type.String(),
});

const routes: FastifyPluginAsyncTypebox = async (server) => {
	server.route({
		method: "GET",
		url: "/countries",
		schema: {
			response: {
				200: Type.Array(CountrySchema),
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
				200: Type.Array(StateSchema),
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
				200: Type.Array(CitySchema),
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
