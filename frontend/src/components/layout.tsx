import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "#/auth/use-auth";
import {
	IconChevronDown,
	IconNote,
	IconPlus,
	IconSignOut,
	IconUser,
} from "#/components/icons";
import { Dropdown } from "./dropdown";

const Layout = ({ children }: { children?: ReactNode }) => {
	const { isAuthenticated, signOut } = useAuth();
	return (
		<>
			<div className="flex flex-col min-h-full">
				<header className="flex flex-col border-b border-base-100">
					<nav className="flex items-center p-3 px-6">
						<Link
							to="/"
							className="text-base-900 font-semibold text-lg tracking-wide"
						>
							MARKETPLACE
						</Link>
						<div className="ml-auto flex items-center gap-3">
							{!isAuthenticated ? (
								<>
									<Link
										to="/signin"
										className="ml-auto border-2 border-primary-400 bg-primary-400 text-base-50 py-1 px-4"
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
									<Dropdown
										label={
											<>
												Account
												<IconChevronDown size="18" />
											</>
										}
										position="top-right"
									>
										<Link
											to="/account"
											className="flex items-center gap-2 p-1.5 px-3 hover:bg-base-50 border-b border-base-100"
										>
											<IconUser className="text-lg" />
											Account
										</Link>
										<Link
											to="/my-listings"
											className="whitespace-nowrap flex items-center gap-2 p-1.5 px-3 hover:bg-base-50 border-b border-base-100"
										>
											<IconNote className="text-lg" />
											My listings
										</Link>
										<button
											onClick={signOut}
											className="whitespace-nowrap flex items-center gap-2 text-red-600/90 p-1.5 px-3 hover:bg-base-50"
										>
											<IconSignOut className="text-lg" />
											Sign out
										</button>
									</Dropdown>
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
