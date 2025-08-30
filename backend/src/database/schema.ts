import { relations, sql } from "drizzle-orm";
import { type PgColumn, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const users = table("users", {
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	email: t.text().notNull().unique(),
});

export const categories = table(
	"categories",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
		name: t.text().notNull(),
		parent_id: t.integer().references((): PgColumn => categories.id),
	},
	(table) => [
		t.unique("uq_categories_name_parent").on(table.name, table.parent_id),
	],
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
	subcategories: many(categories, { relationName: "subcategories" }),
	parent: one(categories, {
		fields: [categories.parent_id],
		references: [categories.id],
		relationName: "subcategories",
	}),
}));

export const listings = table("listings", {
	id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
	seller_id: t
		.text()
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	category_id: t
		.integer()
		.references(() => categories.id, { onDelete: "cascade" })
		.notNull(),
	title: t.text().notNull(),
	description: t.text(),
	price: t.integer().notNull(),
	country_code: t.text().notNull(),
	state_code: t.text(),
	city: t.text(),
	deleted_at: t.text(),
	updated_at: t
		.text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	created_at: t
		.text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
});
