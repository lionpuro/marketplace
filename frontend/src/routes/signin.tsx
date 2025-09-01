import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import Input from "#/components/input";
import { signInWithEmail } from "#/auth/firebase";
import { H1 } from "#/components/headings";
import { toast } from "react-toastify";

export const Route = createFileRoute("/signin")({
	component: SignIn,
});

function SignIn() {
	const navigate = useNavigate();
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const email = form["email"].value;
		const password = form["password"].value;
		try {
			const cred = await signInWithEmail(email, password);
			const token = await cred.user.getIdToken();
			const url = `${import.meta.env.VITE_BACKEND_URL}/users/${cred.user.uid}`;
			const res = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify({ name: cred.user.displayName || email }),
			});
			if (!res.ok) {
				throw new Error("Something went wrong");
			}
			if (!cred.user.emailVerified) {
				return navigate({ to: "/account/verification" });
			}
			navigate({ to: "/" });
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="flex flex-col max-w-lg mx-auto w-full">
			<H1>Sign in</H1>
			<form onSubmit={onSubmit} className="flex flex-col gap-2">
				<label htmlFor="email">Email</label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="Email"
					required
				/>
				<label htmlFor="password">Password</label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Password"
					required
				/>
				<button className="mt-4 bg-primary-400 hover:bg-primary-500 text-base-50 p-2 font-medium">
					Sign in
				</button>
				<p className="text-base-500 mt-2">
					{"Don't have an account? "}
					<Link to="/signup" className="text-blue-500">
						Sign up now
					</Link>
				</p>
			</form>
		</div>
	);
}
