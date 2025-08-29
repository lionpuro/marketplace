import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
	ListingSchema,
	ListingsParamsSchema,
	NewListingBodySchema,
	UpdateListingBodySchema,
} from "../../schemas/listing.js";
import { ErrorResponseSchema } from "../../schemas/index.js";
import { repository } from "../../repository/index.js";
import type { NewListing, ListingUpdate } from "../../types.js";
import { requireAuth } from "../../middleware.js";

const routes: FastifyPluginAsyncTypebox = async (server) => {
	server.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: ListingsParamsSchema,
			response: {
				200: Type.Array(ListingSchema),
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, res) => {
			try {
				const listings = await repository.findListings(req.query);
				return res.code(200).send(listings);
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "GET",
		url: "/:id",
		schema: {
			params: Type.Object({ id: Type.Number() }),
			response: {
				200: ListingSchema,
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, res) => {
			try {
				const listing = await repository.findListing(req.params.id);
				if (!listing) {
					return res.code(404).send({ message: "Not found" });
				}
				return res.code(200).send(listing);
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "POST",
		url: "/",
		schema: {
			body: NewListingBodySchema,
			response: {
				201: Type.Null(),
				500: ErrorResponseSchema,
			},
		},
		preHandler: [requireAuth(server)],
		handler: async (req, res) => {
			try {
				const b = req.body;
				const listing: NewListing = {
					seller_id: req.user.id,
					category_id: b.category_id,
					title: b.title,
					description: b.description,
					price: b.price,
					country_code: b.country_code,
					state_code: b.state_code,
					city: b.city,
				};
				await repository.createListing(listing);
				return res.code(201).send();
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "PUT",
		url: "/:id",
		schema: {
			params: Type.Object({ id: Type.Number() }),
			body: UpdateListingBodySchema,
			response: {
				201: Type.Null(),
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		preHandler: [requireAuth(server)],
		handler: async (req, res) => {
			try {
				const b = req.body;
				const listing: ListingUpdate = {
					category_id: b.category_id,
					title: b.title,
					description: b.description,
					price: b.price,
					country_code: b.country_code,
					state_code: b.state_code,
					city: b.city,
				};
				const updated = await repository.updateListing(
					req.params.id,
					req.user.id,
					listing,
				);
				if (!updated) {
					return res.code(404).send({ message: "Not found" });
				}
				return res.code(201).send();
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			params: Type.Object({ id: Type.Number() }),
			response: {
				204: Type.Null(),
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		preHandler: [requireAuth(server)],
		handler: async (req, res) => {
			try {
				const result = await repository.deleteListing(
					req.user.id,
					req.params.id,
				);
				if (!result) {
					return res.code(404).send({ message: "Not found" });
				}
				return res.code(204).send();
			} catch (err) {
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
};
export default routes;
