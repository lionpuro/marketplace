import { Type } from "@sinclair/typebox";
import { ISO2Schema } from "./location.js";

export const NewListingBodySchema = Type.Object({
	category: Type.Number(),
	title: Type.String(),
	description: Type.Optional(Type.String()),
	price: Type.Number(),
	country: ISO2Schema,
	state: Type.Optional(ISO2Schema),
	city: Type.Optional(Type.String()),
});
