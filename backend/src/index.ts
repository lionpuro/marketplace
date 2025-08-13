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

server.register(cors, {
	origin: "http://localhost:5173",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
});

server.register(fastifyFirebase, firebaseJSON);

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
