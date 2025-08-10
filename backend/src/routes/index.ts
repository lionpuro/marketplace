import type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifyRequest,
} from "fastify";
import { repository } from "../repository/index.js";

const routes: FastifyPluginAsync = async (server: FastifyInstance) => {
	server.route({
		method: "POST",
		url: "/users",
		schema: {
			body: {
				type: "object",
				properties: {
					name: { type: "string" },
				},
				required: ["name"],
			},
		},
		handler: async (
			req: FastifyRequest<{ Body: { name: string; email: string } }>,
			res,
		) => {
			try {
				const { id, email } = req.user;
				const { name } = req.body;
				await repository.createUser({ id: id, name: name, email: email });
				return res.code(201).send();
			} catch (err) {
				return res.code(400).send();
			}
		},
	});
};
export default routes;
