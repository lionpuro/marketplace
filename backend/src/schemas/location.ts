import { Type } from "@sinclair/typebox";

export const ISO2Schema = Type.String({
	minLength: 1,
	maxLength: 3,
});
