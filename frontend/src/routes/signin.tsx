import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import Input from "../components/input";
import { signInWithEmail } from "../auth/firebase";

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
			await signInWithEmail(email, password);
			navigate({ to: "/" });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex flex-col max-w-lg mx-auto w-full">
			<h1 className="text-xl font-semibold mb-8">Sign in</h1>
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
					className="border border-neutral-200 px-3 py-1.5"
					required
				/>
				<button className="mt-4 bg-primary-400 hover:bg-primary-500 text-neutral-50 p-2 font-medium">
					Sign in
				</button>
				<p className="text-neutral-500 mt-2">
					{"Don't have an account? "}
					<Link to="/signup" className="text-blue-500">
						Sign up now
					</Link>
				</p>
			</form>
		</div>
	);
}
