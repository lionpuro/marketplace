import { Type } from "@sinclair/typebox";
import { ISO2Schema } from "./location.js";

export const NewListingBodySchema = Type.Object({
	category_id: Type.Number(),
	title: Type.String(),
	description: Type.Optional(Type.String()),
	price: Type.Number(),
	country_code: ISO2Schema,
	state_code: Type.Optional(ISO2Schema),
	city: Type.Optional(Type.String()),
});
