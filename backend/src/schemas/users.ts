import { Type } from "@sinclair/typebox";

const passwordPattern =
	"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$";

export const PasswordSchema = Type.String({
	pattern: passwordPattern,
	minLength: 8,
});
