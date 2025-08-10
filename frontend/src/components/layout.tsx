import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "../auth/use-auth";

const Layout = ({ children }: { children?: ReactNode }) => {
	const { isAuthenticated, signOut } = useAuth();
	return (
		<>
			<div className="flex flex-col">
				<header className="flex border-b border-neutral-200">
					<nav className="flex items-center p-3 w-full">
						<Link
							to="/"
							className="text-neutral-900 font-semibold text-lg px-3"
						>
							marketplace
						</Link>
						{!isAuthenticated ? (
							<Link
								to="/signin"
								className="ml-auto bg-primary-400 text-neutral-50 py-1.5 px-4"
							>
								Sign in
							</Link>
						) : (
							<button
								onClick={signOut}
								className="ml-auto bg-red-600/80 text-neutral-50 py-1.5 px-4"
							>
								Sign out
							</button>
						)}
					</nav>
				</header>
				<div className="flex flex-col p-8">{children}</div>
			</div>
		</>
	);
};

export default Layout;
