import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { AuthUser } from "./types.js";

type Middleware = <T extends FastifyRequest, U extends FastifyReply>(
	req: T,
	res: U,
) => void;

export function requireAuth(server: FastifyInstance): Middleware {
	return async (req, res) => {
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
	};
}

export async function requireVerifiedEmail(
	req: FastifyRequest,
	res: FastifyReply,
) {
	if (!req.user.email_verified) {
		return res.code(401).send({ message: "unverified email" });
	}
}
