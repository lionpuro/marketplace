import { useAuth } from "#/auth/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type {
	Listing,
	NewListingBody,
	ListingsParams,
	UpdateListingBody,
	ListingsSortOption,
} from "backend";
import { queryKeys } from "./keys";

export function useListings(options?: ListingsParams) {
	const client = useQueryClient();
	const query = useQuery({
		queryFn: async () => {
			const params: {
				sort?: ListingsSortOption;
				seller?: string;
				category?: string;
				country?: string;
				state?: string;
				city?: string;
			} = {};
			if (options?.sort) {
				params.sort = options.sort;
			}
			if (options?.seller) {
				params.seller = options.seller;
			}
			if (options?.category) {
				params.category = options.category.toString();
			}
			if (options?.country) {
				params.country = options.country;
			}
			if (options?.state) {
				params.state = options.state;
			}
			if (options?.city) {
				params.city = options.city.toString();
			}
			const querystring = new URLSearchParams(params).toString();
			const base = `${import.meta.env.VITE_BACKEND_URL}/listings`;
			const url = !options ? base : `${base}?${querystring}`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			const result: Listing[] = await response.json();
			result.forEach((listing) => {
				client.setQueryData([queryKeys.listings, listing.id], listing);
			});
			return result;
		},
		queryKey: options ? [queryKeys.listings, options] : [queryKeys.listings],
	});
	return query;
}

export function useListing(id: number) {
	const query = useQuery({
		queryFn: async () => {
			const url = `${import.meta.env.VITE_BACKEND_URL}/listings/${id}`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			const result: Listing = await response.json();
			return result;
		},
		queryKey: [queryKeys.listings, id],
	});
	return query;
}

export function useCreateListing() {
	const queryClient = useQueryClient();
	const { currentUser } = useAuth();
	const mutation = useMutation({
		mutationFn: async (newListing: NewListingBody) => {
			if (!currentUser) {
				throw new Error("Failed to create listing");
			}
			const token = await currentUser.getIdToken();
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/listings`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token,
					},
					body: JSON.stringify(newListing),
				},
			);
			if (!response.ok) {
				throw new Error(response.statusText);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [queryKeys.listings] });
		},
		onError: (err) => toast.error(err.message),
	});
	return mutation;
}

export function useUpdateListing() {
	const queryClient = useQueryClient();
	const { currentUser } = useAuth();
	const mutation = useMutation({
		mutationFn: async (update: { id: number; listing: UpdateListingBody }) => {
			if (!currentUser) {
				throw new Error("Failed to create listing");
			}
			const token = await currentUser.getIdToken();
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/listings/${update.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token,
					},
					body: JSON.stringify(update.listing),
				},
			);
			if (!response.ok) {
				throw new Error(response.statusText);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [queryKeys.listings] });
		},
		onError: (err) => toast.error(err.message),
	});
	return mutation;
}

export function useDeleteListing() {
	const queryClient = useQueryClient();
	const { currentUser } = useAuth();
	const mutation = useMutation({
		mutationFn: async (id: number) => {
			if (!currentUser) {
				throw new Error("Failed to delete listing");
			}
			const token = await currentUser.getIdToken();
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/listings/${id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + token,
					},
				},
			);
			if (!response.ok) {
				throw new Error(response.statusText);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [queryKeys.listings] });
		},
		onError: (err) => toast.error(err.message),
	});
	return mutation;
}
