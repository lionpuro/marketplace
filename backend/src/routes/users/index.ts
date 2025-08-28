import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { repository } from "../../repository/index.js";
import { requireAuth } from "../../middleware.js";
import { PasswordSchema } from "../../schemas/user.js";
import { FirebaseAuthError } from "firebase-admin/auth";
import { ErrorResponseSchema } from "../../schemas/index.js";

const routes: FastifyPluginAsyncTypebox = async (server) => {
	server.route({
		method: "POST",
		url: "/",
		schema: {
			body: Type.Object({
				name: Type.String(),
				email: Type.String({ format: "email" }),
				password: PasswordSchema,
			}),
			response: {
				201: Type.Object({ id: Type.String() }),
				400: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, res) => {
			try {
				const { name, email, password } = req.body;
				const user = await server.firebase.auth().createUser({
					displayName: name,
					email: email,
					password: password,
				});
				await repository.createUser({ id: user.uid, name: name, email: email });
				return res.code(201).send({ id: user.uid });
			} catch (err) {
				if (err instanceof FirebaseAuthError) {
					switch (err.code) {
						case "auth/email-already-exists":
							return res.code(400).send({ message: err.code });
						case "auth/invalid-email":
							return res.code(400).send({ message: "body/email" });
					}
				}
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});

	server.route({
		method: "PUT",
		url: "/:id",
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
				await repository.upsertUser({
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
		url: "/:id",
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
