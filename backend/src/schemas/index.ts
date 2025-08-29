import { Type, type TSchema } from "@sinclair/typebox";

export const ErrorResponseSchema = Type.Object({
	message: Type.String(),
});

export const Nullable = <T extends TSchema>(schema: T) => {
	return Type.Union([schema, Type.Null()]);
};
