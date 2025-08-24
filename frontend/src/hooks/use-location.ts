import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { City, Country, State } from "backend";
import { queryKeys } from "#/constants";

const requestOptions: RequestInit = {
	method: "GET",
	headers: { "Content-Type": "application/json" },
};

export function useLocation() {
	const [location, setLocation] = useState<{
		country?: string;
		state?: string;
		city?: string;
	}>({});

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
			const url = `${import.meta.env.VITE_BACKEND_URL}/locations/countries/${location.country}/states`;
			const res = await fetch(url, requestOptions);
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			const states: State[] = await res.json();
			return states;
		},
		queryKey: [location.country, queryKeys.states],
		enabled: !!location.country,
	});

	const { data: cities, error: citiesError } = useQuery({
		queryFn: async () => {
			const url = `${import.meta.env.VITE_BACKEND_URL}/locations/countries/${location.country}/states/${location.state}/cities`;
			const res = await fetch(url, requestOptions);
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			const cities: City[] = await res.json();
			return cities;
		},
		queryKey: [
			location.country,
			queryKeys.states,
			location.state,
			queryKeys.cities,
		],
		enabled: !!location.country && !!location.state,
	});

	return {
		location,
		setLocation,
		data: { countries, states, cities },
		errors: {
			countries: countriesError,
			states: statesError,
			cities: citiesError,
		},
	};
}
