import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "#/auth/use-auth";
import { IconPlus, IconSignOut, IconUser } from "#/components/icons";

const Layout = ({ children }: { children?: ReactNode }) => {
	const { isAuthenticated, signOut } = useAuth();
	return (
		<>
			<div className="flex flex-col min-h-full">
				<header className="flex border-b border-neutral-200">
					<nav className="flex items-center p-3 w-full px-6">
						<Link to="/" className="text-neutral-900 font-semibold text-lg">
							marketplace
						</Link>
						<div className="ml-auto flex items-center gap-3">
							{!isAuthenticated ? (
								<>
									<Link
										to="/signin"
										className="ml-auto border-2 border-primary-400 bg-primary-400 text-neutral-50 py-1 px-4"
									>
										Sign in
									</Link>
									<Link
										to="/signup"
										className="ml-auto border-2 border-primary-400 text-primary-500 font-medium py-1 px-4"
									>
										Sign up
									</Link>
								</>
							) : (
								<>
									<Link
										to="/listings/new"
										className="flex items-center gap-1 text-primary-700 p-1.5"
									>
										<IconPlus className="text-lg" />
										New listing
									</Link>
									<Link
										to="/account"
										className="flex items-center gap-1 text-primary-700 p-1.5"
									>
										<IconUser className="text-lg" />
										Account
									</Link>
									<button
										onClick={signOut}
										className="flex items-center gap-1 text-red-600/90 p-1.5"
									>
										<IconSignOut className="text-lg" />
										Sign out
									</button>
								</>
							)}
						</div>
					</nav>
				</header>
				<div className="flex flex-col p-8 grow">{children}</div>
			</div>
		</>
	);
};

export default Layout;
