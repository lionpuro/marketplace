import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import cors from "@fastify/cors";
import fastifyFirebase from "fastify-firebase";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { AuthUser } from "./types.js";
import firebaseJSON from "../firebase.json" with { type: "json" };

declare module "fastify" {
	interface FastifyRequest {
		user: AuthUser;
	}
}

const server = Fastify({
	logger: true,
});

server.register(cors, { origin: "http://localhost:5173" });

server.register(fastifyFirebase, firebaseJSON);

server.addHook("preHandler", async (req, res) => {
	const token = req.headers.authorization?.match(/^[Bb]earer (\S+)/)?.[1];
	if (!token) {
		return res.code(401).send({ message: "Unauthorized" });
	}
	try {
		const decoded = await server.firebase.auth().verifyIdToken(token);
		if (!decoded.uid || !decoded.email) {
			return res.code(401).send({ message: "Unauthorized" });
		}
		const user: AuthUser = {
			id: decoded.uid,
			email: decoded.email,
			email_verified: decoded.email_verified === true,
		};
		req.user = user;
	} catch (err) {
		return res.code(401).send({ message: "Unauthorized" });
	}
});

server.register(AutoLoad, {
	dir: path.join(dirname(fileURLToPath(import.meta.url)), "routes"),
});

async function start() {
	try {
		await server.listen({ port: 3000 });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}
start();
