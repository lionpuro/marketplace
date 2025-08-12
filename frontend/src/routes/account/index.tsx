import { createFileRoute, Link } from "@tanstack/react-router";
import { Protected } from "../../components/protected";
import { useAuth } from "../../auth/use-auth";
import { H1 } from "../../components/headings";

export const Route = createFileRoute("/account/")({
	component: Component,
});

function Component() {
	const { currentUser } = useAuth();
	return (
		<div className="flex flex-col grow gap-8 w-full max-w-screen-sm mx-auto">
			<H1>Account</H1>
			<Protected allowUnverified={true}>
				<>
					{currentUser && (
						<div className="flex flex-col gap-4">
							<h2 className="font-semibold text-lg"> User information </h2>
							<div className="flex">
								<h3 className="font-medium min-w-36"> Name </h3>
								<span>{currentUser.displayName}</span>
							</div>
							<div className="flex">
								<h3 className="font-medium min-w-36"> Email </h3>
								<span>{currentUser.email}</span>
							</div>
							{!currentUser.emailVerified && (
								<p className="text-sm text-neutral-600">
									{"Your email is unverified. "}
									<Link to="/account/verification" className="text-blue-500">
										Click here to verify your email
									</Link>
								</p>
							)}
						</div>
					)}
				</>
			</Protected>
		</div>
	);
}
