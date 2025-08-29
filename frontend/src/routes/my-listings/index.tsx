import { useAuth } from "#/auth/use-auth";
import { H1 } from "#/components/headings";
import { Listings } from "#/components/listings";
import { Protected } from "#/components/protected";
import { useListings } from "#/query/listings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-listings/")({
	component: Component,
});

function Component() {
	const { currentUser } = useAuth();
	const { data: listings } = useListings({ seller: currentUser?.uid });
	return (
		<div className="flex flex-col grow gap-4 w-full max-w-screen-sm mx-auto">
			<H1>My listings</H1>
			<Protected>
				<Listings listings={listings} />
			</Protected>
		</div>
	);
}
