import { updateProfile, type UserCredential } from "firebase/auth";
import { createUserWithEmail } from "./firebase";

export async function signup(
	name: string,
	email: string,
	password: string,
): Promise<UserCredential> {
	const cred = await createUserWithEmail(email, password);
	await updateProfile(cred.user, {
		displayName: name,
	});

	return cred;
}

export async function createUser(cred: UserCredential) {
	const token = await cred.user.getIdToken();

	const url = import.meta.env.VITE_API_BASE_URL;
	const response = await fetch(`${url}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		body: JSON.stringify({
			name: cred.user.displayName || cred.user.email,
			email: cred.user.email,
		}),
	});
	if (!response.ok) {
		throw new Error("Failed to create user");
	}
}
