import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent } from "react";
import Input from "../components/input";
import { createUser, signup } from "../auth";

export const Route = createFileRoute("/signup")({
	component: SignUp,
});

function SignUp() {
	const navigate = useNavigate();

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const name = form["display_name"].value;
		const email = form["email"].value;
		const password = form["password"].value;

		try {
			const cred = await signup(name, email, password);
			await createUser(cred);
			if (!cred.user.emailVerified) {
				navigate({ to: "/account/verification" });
				return;
			}
			navigate({ to: "/" });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex flex-col max-w-lg mx-auto w-full">
			<h1 className="text-xl font-semibold mb-8">Sign up</h1>
			<form onSubmit={onSubmit} className="flex flex-col gap-2">
				<label htmlFor="display_name">Name</label>
				<Input
					id="display_name"
					name="display_name"
					type="text"
					placeholder="Name"
					required
				/>
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
				<button className="mt-4 bg-primary-400 hover:bg-primary-500 text-neutral-50 p-2 font-medium">
					Sign up
				</button>
				<p className="text-neutral-500 mt-2">
					{"Already have an account? "}
					<Link to="/signin" className="text-blue-500">
						Sign in now
					</Link>
				</p>
			</form>
		</div>
	);
}
