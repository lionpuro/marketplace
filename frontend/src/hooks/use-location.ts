import { useQuery } from "@tanstack/react-query";
import type { City, Country, State } from "backend";
import { queryKeys } from "#/query/keys";

const requestOptions: RequestInit = {
	method: "GET",
	headers: { "Content-Type": "application/json" },
};

type Location = {
	country?: string;
	state?: string;
	city?: string;
};

export function useLocation(selected: Location) {
	const { data: countries, error: countriesError } = useQuery({
		queryFn: async () => {
			const url = `${import.meta.env.VITE_BACKEND_URL}/locations/countries`;
			const res = await fetch(url, requestOptions);
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			const countries: Country[] = await res.json();
			return countries;
		},
		queryKey: [queryKeys.countries],
	});

	const { data: states, error: statesError } = useQuery({
		queryFn: async () => {
			const url = `${import.meta.env.VITE_BACKEND_URL}/locations/countries/${selected.country}/states`;
			const res = await fetch(url, requestOptions);
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			const states: State[] = await res.json();
			return states;
		},
		queryKey: [selected.country, queryKeys.states],
		enabled: !!selected.country,
	});

	const { data: cities, error: citiesError } = useQuery({
		queryFn: async () => {
			const url = `${import.meta.env.VITE_BACKEND_URL}/locations/countries/${selected.country}/states/${selected.state}/cities`;
			const res = await fetch(url, requestOptions);
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			const cities: City[] = await res.json();
			return cities;
		},
		queryKey: [
			selected.country,
			queryKeys.states,
			selected.state,
			queryKeys.cities,
		],
		enabled: !!selected.country && !!selected.state,
	});

	return {
		data: { countries, states, cities },
		errors: {
			countries: countriesError,
			states: statesError,
			cities: citiesError,
		},
	};
}
