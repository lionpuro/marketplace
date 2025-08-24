import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { NewListingBodySchema } from "../../schemas/listing.js";
import { ErrorResponseSchema } from "../../schemas/index.js";
import { repository } from "../../repository/index.js";
import type { NewListing } from "../../types.js";
import { requireAuth } from "../../middleware.js";

const routes: FastifyPluginAsyncTypebox = async (server) => {
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
					category_id: b.category,
					title: b.title,
					description: b.description,
					price: b.price,
					country_code: b.country,
					state_code: b.state,
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
};
export default routes;
