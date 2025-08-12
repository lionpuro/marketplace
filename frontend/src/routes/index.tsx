import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "#/auth/use-auth";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { currentUser } = useAuth();
	return <div>{!!currentUser && `Hello, ${currentUser.email}`}</div>;
}
