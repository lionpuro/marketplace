import { useAuth } from "#/auth/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { NewListingBody } from "backend";
import { queryKeys } from "./keys";

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
