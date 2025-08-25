import { queryKeys } from "#/query/keys";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "backend";

export function useCategories() {
	const query = useQuery({
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/categories`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				},
			);
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			const result: Category[] = await response.json();
			return result;
		},
		queryKey: [queryKeys.categories],
	});
	return query;
}
