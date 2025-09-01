import { Type } from "@sinclair/typebox";
import { ISO2Schema } from "./location.js";
import { Nullable } from "./index.js";
import { CategorySchema } from "./category.js";

export const ListingSchema = Type.Object({
	id: Type.Number(),
	seller_id: Type.String(),
	title: Type.String(),
	description: Nullable(Type.String()),
	price: Type.Number(),
	created_at: Type.String(),
	updated_at: Type.String(),
	category: CategorySchema,
	location: Type.Object({
		country: Nullable(Type.String()),
		country_code: Nullable(Type.String()),
		country_emoji: Nullable(Type.String()),
		state: Nullable(Type.String()),
		state_code: Nullable(Type.String()),
		city: Nullable(Type.String()),
		city_id: Nullable(Type.Number()),
	}),
});

export const ListingsSortOption = Type.Union([
	Type.Literal("date|desc"),
	Type.Literal("date|asc"),
	Type.Literal("price|asc"),
	Type.Literal("price|desc"),
]);

export const ListingsParamsSchema = Type.Object({
	q: Type.Optional(Type.String()),
	seller: Type.Optional(Type.String()),
	category: Type.Optional(Type.Number()),
	country: Type.Optional(Type.String()),
	state: Type.Optional(Type.String()),
	city: Type.Optional(Type.Number()),
	sort: Type.Optional(ListingsSortOption),
});

export const NewListingBodySchema = Type.Object({
	category_id: Type.Number(),
	title: Type.String(),
	description: Type.Optional(Type.String()),
	price: Type.Number(),
	country_code: ISO2Schema,
	state_code: Type.Optional(ISO2Schema),
	city: Type.Optional(Type.Number()),
});

export const UpdateListingBodySchema = Type.Object({
	category_id: Type.Number(),
	title: Type.String(),
	description: Type.Optional(Type.String()),
	price: Type.Number(),
	country_code: ISO2Schema,
	state_code: Type.Optional(ISO2Schema),
	city: Type.Optional(Type.Number()),
});
