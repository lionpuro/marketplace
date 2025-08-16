import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { repository } from "../repository/index.js";
import { requireAuth } from "../middleware.js";

const ErrorResponseSchema = Type.Object({
	message: Type.String(),
});

const routes: FastifyPluginAsyncTypebox = async (server) => {
	server.route({
		method: "POST",
		url: "/users",
		schema: {
			body: Type.Object({
				name: Type.String(),
			}),
			response: {
				201: Type.Null(),
				500: ErrorResponseSchema,
			},
		},
		preHandler: [requireAuth(server)],
		handler: async (req, res) => {
			try {
				const { id, email } = req.user;
				const { name } = req.body;
				await repository.createUser({ id: id, name: name, email: email });
				return res.code(201).send();
			} catch (err) {
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});

	server.route({
		method: "PUT",
		url: "/users/:id",
		schema: {
			params: Type.Object({ id: Type.String() }),
			body: Type.Object({
				name: Type.String(),
			}),
			response: {
				204: Type.Null(),
				401: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		preHandler: [requireAuth(server)],
		handler: async (req, res) => {
			try {
				const { id } = req.params;
				if (id !== req.user.id) {
					return res.code(401).send({ message: "Unauthorized" });
				}
				const { name } = req.body;
				await repository.updateUser({
					id: id,
					name: name,
					email: req.user.email,
				});
				return res.code(204).send();
			} catch (err) {
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});

	server.route({
		method: "DELETE",
		url: "/users/:id",
		schema: {
			params: Type.Object({ id: Type.String() }),
			response: {
				204: Type.Null(),
				401: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		preHandler: [requireAuth(server)],
		handler: async (req, res) => {
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
