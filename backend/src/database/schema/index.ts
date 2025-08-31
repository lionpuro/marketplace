import { relations, sql } from "drizzle-orm";
import { type PgColumn, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const subregions = table(
	"subregions",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: t.bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "subregions_id_seq",
			startWith: 1,
			increment: 1,
			cache: 1,
		}),
		name: t.varchar({ length: 100 }).notNull(),
		translations: t.text(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		region_id: t.bigint("region_id", { mode: "number" }).notNull(),
		created_at: t.timestamp("created_at", { mode: "string" }),
		updated_at: t
			.timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		flag: t.smallint().default(1).notNull(),
		wikiDataId: t.varchar({ length: 255 }),
	},
	(table) => [
		t
			.index("subregions_region_id_idx")
			.using("btree", table.region_id.asc().nullsLast().op("int8_ops")),
		t.foreignKey({
			columns: [table.region_id],
			foreignColumns: [regions.id],
			name: "subregions_region_id_fkey",
		}),
	],
);

export const states = table(
	"states",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: t.bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "states_id_seq",
			startWith: 1,
			increment: 1,
			cache: 1,
		}),
		name: t.varchar({ length: 255 }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		country_id: t.bigint("country_id", { mode: "number" }).notNull(),
		country_code: t.char("country_code", { length: 2 }).notNull(),
		fips_code: t.varchar("fips_code", { length: 255 }),
		iso2: t.varchar({ length: 255 }),
		iso3166_2: t.varchar("iso3166_2", { length: 10 }),
		type: t.varchar({ length: 191 }),
		level: t.integer(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		parent_id: t.bigint("parent_id", { mode: "number" }),
		native: t.varchar({ length: 255 }),
		latitude: t.numeric({ precision: 10, scale: 8 }),
		longitude: t.numeric({ precision: 11, scale: 8 }),
		timezone: t.varchar({ length: 255 }),
		created_at: t.timestamp("created_at", { mode: "string" }),
		updated_at: t
			.timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		flag: t.smallint().default(1).notNull(),
		wikiDataId: t.varchar({ length: 255 }),
	},
	(table) => [
		t
			.index("states_country_id_idx")
			.using("btree", table.country_id.asc().nullsLast().op("int8_ops")),
		t.foreignKey({
			columns: [table.country_id],
			foreignColumns: [countries.id],
			name: "states_country_id_fkey",
		}),
	],
);

export const regions = table("regions", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: t.bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
		name: "regions_id_seq",
		startWith: 1,
		increment: 1,
		cache: 1,
	}),
	name: t.varchar({ length: 100 }).notNull(),
	translations: t.text(),
	created_at: t.timestamp("created_at", { mode: "string" }),
	updated_at: t
		.timestamp("updated_at", { mode: "string" })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	flag: t.smallint().default(1).notNull(),
	wikiDataId: t.varchar({ length: 255 }),
});

export const countries = table(
	"countries",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: t.bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "countries_id_seq",
			startWith: 1,
			increment: 1,
			cache: 1,
		}),
		name: t.varchar({ length: 100 }).notNull(),
		iso3: t.char({ length: 3 }),
		numeric_code: t.char("numeric_code", { length: 3 }),
		iso2: t.char({ length: 2 }),
		phonecode: t.varchar({ length: 255 }),
		capital: t.varchar({ length: 255 }),
		currency: t.varchar({ length: 255 }),
		currency_name: t.varchar("currency_name", { length: 255 }),
		currency_symbol: t.varchar("currency_symbol", { length: 255 }),
		tld: t.varchar({ length: 255 }),
		native: t.varchar({ length: 255 }),
		region: t.varchar({ length: 255 }),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		region_id: t.bigint("region_id", { mode: "number" }),
		subregion: t.varchar({ length: 255 }),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		subregion_id: t.bigint("subregion_id", { mode: "number" }),
		nationality: t.varchar({ length: 255 }),
		timezones: t.text(),
		translations: t.text(),
		latitude: t.numeric({ precision: 10, scale: 8 }),
		longitude: t.numeric({ precision: 11, scale: 8 }),
		emoji: t.varchar({ length: 191 }),
		emojiU: t.varchar({ length: 191 }),
		created_at: t.timestamp("created_at", { mode: "string" }),
		updated_at: t
			.timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		flag: t.smallint().default(1).notNull(),
		wikiDataId: t.varchar({ length: 255 }),
	},
	(table) => [
		t
			.index("countries_region_id_idx")
			.using("btree", table.region_id.asc().nullsLast().op("int8_ops")),
		t
			.index("countries_subregion_id_idx")
			.using("btree", table.subregion_id.asc().nullsLast().op("int8_ops")),
		t.foreignKey({
			columns: [table.region_id],
			foreignColumns: [regions.id],
			name: "countries_region_id_fkey",
		}),
		t.foreignKey({
			columns: [table.subregion_id],
			foreignColumns: [subregions.id],
			name: "countries_subregion_id_fkey",
		}),
	],
);

export const cities = table(
	"cities",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: t.bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
			name: "cities_id_seq",
			startWith: 1,
			increment: 1,
			cache: 1,
		}),
		name: t.varchar({ length: 255 }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		state_id: t.bigint("state_id", { mode: "number" }).notNull(),
		state_code: t.varchar("state_code", { length: 255 }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		country_id: t.bigint("country_id", { mode: "number" }).notNull(),
		country_code: t.char("country_code", { length: 2 }).notNull(),
		latitude: t.numeric({ precision: 10, scale: 8 }).notNull(),
		longitude: t.numeric({ precision: 11, scale: 8 }).notNull(),
		timezone: t.varchar({ length: 255 }),
		created_at: t
			.timestamp("created_at", { mode: "string" })
			.default("2014-01-01 12:01:01")
			.notNull(),
		updated_at: t
			.timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		flag: t.smallint().default(1).notNull(),
		wikiDataId: t.varchar({ length: 255 }),
	},
	(table) => [
		t
			.index("cities_country_id_idx")
			.using("btree", table.country_id.asc().nullsLast().op("int8_ops")),
		t
			.index("cities_state_id_idx")
			.using("btree", table.state_id.asc().nullsLast().op("int8_ops")),
		t.foreignKey({
			columns: [table.country_id],
			foreignColumns: [countries.id],
			name: "cities_country_id_fkey",
		}),
		t.foreignKey({
			columns: [table.state_id],
			foreignColumns: [states.id],
			name: "cities_state_id_fkey",
		}),
	],
);

export const subregionsRelations = relations(subregions, ({ one, many }) => ({
	region: one(regions, {
		fields: [subregions.region_id],
		references: [regions.id],
	}),
	countries: many(countries),
}));

export const regionsRelations = relations(regions, ({ many }) => ({
	subregions: many(subregions),
	countries: many(countries),
}));

export const statesRelations = relations(states, ({ one, many }) => ({
	country: one(countries, {
		fields: [states.country_id],
		references: [countries.id],
	}),
	cities: many(cities),
}));

export const countriesRelations = relations(countries, ({ one, many }) => ({
	states: many(states),
	region: one(regions, {
		fields: [countries.region_id],
		references: [regions.id],
	}),
	subregion: one(subregions, {
		fields: [countries.subregion_id],
		references: [subregions.id],
	}),
	cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one }) => ({
	country: one(countries, {
		fields: [cities.country_id],
		references: [countries.id],
	}),
	state: one(states, {
		fields: [cities.state_id],
		references: [states.id],
	}),
}));

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
	city: t.integer().references(() => cities.id),
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
