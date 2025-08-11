import { useState, useEffect, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { signOutUser, userStateListener } from "./firebase";
import { AuthContext } from "./context";

interface Props {
	children?: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
		const localData = localStorage.getItem("isAuthenticated");
		if (!localData) return false;
		return JSON.parse(localData) === true ? true : false;
	});
	const setAuth = (val: boolean) => {
		setIsAuthenticated(val);
		localStorage.setItem("isAuthenticated", JSON.stringify(val));
	};

	useEffect(() => {
		const unsubscribe = userStateListener((user) => {
			if (user) {
				setCurrentUser(user);
				setAuth(true);
			}
		});
		return unsubscribe;
	}, [setCurrentUser]);

	const signOut = () => {
		signOutUser();
		setCurrentUser(null);
		setAuth(false);
	};

	const value = {
		currentUser,
		setCurrentUser,
		signOut,
		isAuthenticated,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
