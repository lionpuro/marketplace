import { drizzle } from "drizzle-orm/sqlite-proxy";
import type { Database } from "../types.js";

export function newDatabase(): Database {
	const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN } =
		process.env;
	const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;

	return drizzle(async (sql, params, method) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${CLOUDFLARE_D1_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sql, params, method }),
		});

		const data = (await res.json()) as Record<string, any>;

		if (res.status !== 200) {
			throw new Error(
				`sqlite proxy: ${res.status} ${res.statusText}\n${JSON.stringify(data)}`,
			);
		}
		if (data.errors.length > 0 || !data.success) {
			throw new Error(`sqlite proxy: \n${JSON.stringify(data)}}`);
		}

		const result = data.result[0];

		if (!result.success) {
			throw new Error(`sqlite proxy: \n${JSON.stringify(data)}`);
		}

		return { rows: result.results.map((r: any) => Object.values(r)) };
	});
}

export const db = newDatabase();
