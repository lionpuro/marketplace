import { signInUser, signUpUser } from "./firebase";

export async function signup(name: string, email: string, password: string) {
	const cred = await signUpUser(email, password);
	if (!cred) {
		throw new Error("Failed to register");
	}

	const token = await cred.user.getIdToken();

	const url = import.meta.env.VITE_API_BASE_URL;
	const response = await fetch(`${url}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		body: JSON.stringify({ name: name, email: email }),
	});
	if (!response.ok) {
		throw new Error("Failed to create user");
	}
}

export async function signin(email: string, password: string) {
	const cred = await signInUser(email, password);
	if (!cred) {
		throw new Error("Failed to sign in");
	}
}
