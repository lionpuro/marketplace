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
	server.route({
		method: "DELETE",
		url: "/users/:id",
		schema: {
			params: {
				type: "object",
				properties: {
					id: { type: "string" },
				},
			},
		},
		handler: async (req: FastifyRequest<{ Params: { id: string } }>, res) => {
			try {
				const { id } = req.params;
				if (id !== req.user.id) {
					return res.code(401).send({ message: "Unauthorized" });
				}
				await server.firebase.auth().deleteUser(id);
				await repository.deleteUser(id);
				return res.code(204).send();
			} catch (err) {
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
};
export default routes;
