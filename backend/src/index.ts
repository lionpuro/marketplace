import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import fastifyFirebase from "fastify-firebase";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
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
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(fastifyFirebase, firebaseJSON);

await server.register(AutoLoad, {
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
