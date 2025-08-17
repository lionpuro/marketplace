import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import Input from "#/components/input";
import { H1 } from "#/components/headings";
import { toast } from "react-toastify";

export const Route = createFileRoute("/signup")({
	component: SignUp,
});

type FormErrors = {
	name?: string;
	email?: string;
	password?: string;
};

function SignUp() {
	const navigate = useNavigate();
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const name = form["display_name"].value;
		const email = form["email"].value;
		const password = form["password"].value;

		try {
			const url = `${import.meta.env.VITE_API_BASE_URL}/users`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name,
					email: email,
					password: password,
				}),
			});
			const result = await response.json();

			if (!response.ok) {
				if (result.message) {
					throw new Error(result.message);
				}
				throw new Error("Something went wrong");
			}

			toast.success("Account created");
			navigate({ to: "/signin" });
		} catch (err) {
			if (err instanceof Error) {
				const errors: FormErrors = {};
				if (err.message === "auth/email-already-exists") {
					errors.email = "Email already in use";
				}
				if (err.message.includes("body/name")) {
					errors.name = "Invalid name";
				}
				if (err.message.includes("body/email")) {
					errors.email = "Invalid email";
				}
				if (err.message.includes("body/password")) {
					errors.password =
						"Password must contain both upper and lowercase letters, at least one number and at least one special character";
				}
				setFormErrors(errors);
			}
		}
	};

	return (
		<div className="flex flex-col max-w-lg mx-auto w-full">
			<H1>Sign up</H1>
			<form onSubmit={onSubmit} className="flex flex-col gap-2">
				<label htmlFor="display_name">Name</label>
				<Input
					id="display_name"
					name="display_name"
					type="text"
					placeholder="Name"
					required
					onInput={() => setFormErrors({ ...formErrors, name: undefined })}
				/>
				<span className="text-red-600/80 text-sm">
					{formErrors.name && formErrors.name}
				</span>
				<label htmlFor="email">Email</label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="Email"
					required
					onInput={() => setFormErrors({ ...formErrors, email: undefined })}
				/>
				<span className="text-red-600/90 text-sm">
					{formErrors.email && formErrors.email}
				</span>
				<label htmlFor="password">Password</label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Password"
					required
					onInput={() => setFormErrors({ ...formErrors, password: undefined })}
				/>
				<span className="text-red-600/80 text-sm">
					{formErrors.password && formErrors.password}
				</span>
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
