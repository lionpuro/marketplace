import { useAuth } from "#/auth/use-auth";
import { Layout } from "#/components/layout";
import { Listings } from "#/components/listings";
import { Protected } from "#/components/protected";
import { useListings } from "#/query/listings";
import { Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-listings/")({
	component: Component,
});

function Component() {
	const { currentUser } = useAuth();
	const { data: listings } = useListings({ seller: currentUser?.uid });
	return (
		<Layout>
			<Title order={1} mb="lg">
				My listings
			</Title>
			<Protected>
				<Listings listings={listings} />
			</Protected>
		</Layout>
	);
}
