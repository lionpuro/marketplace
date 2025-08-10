import { initializeApp, type FirebaseOptions } from "firebase/app";
import {
	getAuth,
	onAuthStateChanged,
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	type UserCredential,
	type User,
	type NextOrObserver,
} from "firebase/auth";

const config: FirebaseOptions = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(config);

export const auth = getAuth(app);

export const signInUser = async (
	email: string,
	password: string,
): Promise<UserCredential | undefined> => {
	if (!email || !password) return;
	return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpUser = async (email: string, password: string) => {
	if (!email || !password) return;
	return await createUserWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const userStateListener = (callback: NextOrObserver<User>) => {
	return onAuthStateChanged(auth, callback);
};
