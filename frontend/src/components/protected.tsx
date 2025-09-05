import type { ReactNode } from "react";
import { useAuth } from "#/auth/use-auth";
import { Navigate } from "@tanstack/react-router";
import { Loading } from "./loading";

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
		return <Loading />;
	}
	if (!allowUnverified && !currentUser.emailVerified) {
		return <Navigate to="/account/verification" />;
	}
	return children;
};
