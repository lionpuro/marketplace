import type { FastifyReply, FastifyRequest } from "fastify";

export async function requireVerifiedEmail(
	req: FastifyRequest,
	res: FastifyReply,
) {
	if (!req.user.email_verified) {
		return res.code(401).send({ message: "unverified email" });
	}
}
