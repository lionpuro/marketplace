import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { repository } from "../repository/index.js";
import { ErrorResponseSchema } from "../schemas/index.js";

const routes: FastifyPluginAsyncTypebox = async (server) => {
	server.route({
		method: "GET",
		url: "/categories",
		schema: {
			response: {
				200: Type.Array(
					Type.Object({
						id: Type.Number(),
						name: Type.String(),
					}),
				),
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, res) => {
			try {
				const categories = await repository.getCategories();
				return res.code(200).send(categories);
			} catch (err) {
				console.error(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
};
export default routes;
