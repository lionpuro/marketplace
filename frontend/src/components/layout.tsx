import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const Layout = ({ children }: { children?: ReactNode }) => {
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
						<Link
							to="/signin"
							className="ml-auto bg-primary-500 text-neutral-50 py-1.5 px-4"
						>
							Sign in
						</Link>
					</nav>
				</header>
				{children}
			</div>
		</>
	);
};

export default Layout;
