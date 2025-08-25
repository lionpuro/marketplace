import { useAuth } from "#/auth/use-auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

type Inputs = {
	category: number;
	title: string;
	description?: string;
	price: number;
	country: string;
	state?: string;
	city?: string;
};

export function useCreateListing() {
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const mutation = useMutation({
		mutationFn: async (newListing: Inputs) => {
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
		onSuccess: () => navigate({ to: "/" }),
		onError: (err) => toast.error(err.message),
	});
	return mutation;
}
