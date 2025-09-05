import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Container, Input, Stack, Title } from "@mantine/core";
import { Layout } from "#/components/layout";
import { Link } from "#/components/link";
import FormError from "#/components/form-error";

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
			const url = `${import.meta.env.VITE_BACKEND_URL}/users`;
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
		<Layout>
			<Container size="xs" w="100%">
				<Title order={1} mb="lg">
					Sign up
				</Title>
				<form onSubmit={onSubmit}>
					<Stack gap="md">
						<label htmlFor="display_name">Name</label>
						<Input
							id="display_name"
							name="display_name"
							type="text"
							placeholder="Name"
							required
							onInput={() => setFormErrors({ ...formErrors, name: undefined })}
						/>
						<FormError message={formErrors.name} />
						<label htmlFor="email">Email</label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Email"
							required
							onInput={() => setFormErrors({ ...formErrors, email: undefined })}
						/>
						<FormError message={formErrors.email} />
						<label htmlFor="password">Password</label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Password"
							required
							onInput={() =>
								setFormErrors({ ...formErrors, password: undefined })
							}
						/>
						<FormError message={formErrors.password} />
						<Button type="submit" mt="sm">
							Sign up
						</Button>
						<p>
							{"Already have an account? "}
							<Link to="/signin" c="blue">
								Sign in now
							</Link>
						</p>
					</Stack>
				</form>
			</Container>
		</Layout>
	);
}
