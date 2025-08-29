import { type AnyColumn, type GetColumnData, type SQL } from "drizzle-orm";

export function aliasColumn<T extends AnyColumn>(
	column: T,
	alias: string,
): SQL.Aliased<GetColumnData<T>> {
	return column.getSQL().mapWith(column.mapFromDriverValue).as(alias);
}
