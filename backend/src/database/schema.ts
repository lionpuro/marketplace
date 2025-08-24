import { relations, sql } from "drizzle-orm";
import {
	type SQLiteColumn,
	integer,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
});

export const categories = sqliteTable(
	"categories",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		name: text().notNull(),
		parent_id: integer().references((): SQLiteColumn => categories.id),
	},
	(t) => [unique("uq_categories_name_parent").on(t.name, t.parent_id)],
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
	subcategories: many(categories, { relationName: "subcategories" }),
	parent: one(categories, {
		fields: [categories.parent_id],
		references: [categories.id],
		relationName: "subcategories",
	}),
}));

export const listings = sqliteTable("listings", {
	id: integer().primaryKey({ autoIncrement: true }),
	seller_id: text()
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	category_id: integer()
		.references(() => categories.id, { onDelete: "cascade" })
		.notNull(),
	title: text().notNull(),
	description: text(),
	price: integer().notNull(),
	country_code: text().notNull(),
	state_code: text(),
	city: text(),
	deleted_at: text(),
	updated_at: text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	created_at: text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
});
