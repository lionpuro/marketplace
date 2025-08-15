import type { ReactNode } from "react";
import { useAuth } from "#/auth/use-auth";
import { Navigate } from "@tanstack/react-router";
import { Spinner } from "#/components/spinner";

export const Protected = ({
	allowUnverified = false,
	children,
}: {
	allowUnverified?: boolean;
	children: ReactNode;
}) => {
	const { isAuthenticated, currentUser } = useAuth();
	if (!isAuthenticated) {
		return <Navigate to="/signin" />;
	}
	if (!currentUser) {
		return (
			<div className="flex justify-center items-center grow">
				<Spinner
					size={36}
					className="fixed left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] text-neutral-400"
				/>
			</div>
		);
	}
	if (!allowUnverified && !currentUser.emailVerified) {
		return <Navigate to="/account/verification" />;
	}
	return children;
};
