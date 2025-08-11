import { createContext } from "react";
import type { User } from "firebase/auth";

export const AuthContext = createContext({
	currentUser: {} as User | null,
	setCurrentUser: (_user: User) => {},
	signOut: () => {},
	isAuthenticated: false,
});
