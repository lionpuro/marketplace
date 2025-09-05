import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type MouseEvent } from "react";
import { Protected } from "#/components/protected";
import { useAuth } from "#/auth/use-auth";
import { IconTrash } from "#/components/icons";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { Layout } from "#/components/layout";
import {
	Modal,
	Box,
	Button,
	Group,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { Link } from "#/components/link";
import { useDisclosure } from "@mantine/hooks";

export const Route = createFileRoute("/account/")({
	component: Component,
});

function Component() {
	const { currentUser, signOut } = useAuth();
	const [displayName, setDisplayName] = useState(
		currentUser?.displayName ?? "",
	);
	const [isEditing, setIsEditing] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);

	const onDelete = async () => {
		if (!currentUser) {
			return;
		}
		try {
			const token = await currentUser.getIdToken();
			const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.uid}`;
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + token,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to delete user");
			}
			close();
			signOut();
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};

	const toggleEditing = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsEditing(!isEditing);
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const name = form["display_name"].value;
		if (!currentUser || name === "") {
			return;
		}
		if (name === currentUser.displayName) {
			setIsEditing(false);
			return;
		}
		try {
			const token = await currentUser.getIdToken();
			const url = `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.uid}`;
			const [res] = await Promise.all([
				fetch(url, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token,
					},
					body: JSON.stringify({ name: name }),
				}),
				updateProfile(currentUser, { displayName: name }),
			]);
			if (!res.ok) {
				throw new Error("failed to update user");
			}
			toast.success("Account details updated successfully");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
		setIsEditing(false);
	};

	return (
		<Layout>
			<div>
				<Title order={1} mb="md">
					Account
				</Title>
				<Protected allowUnverified={true}>
					<>
						{currentUser && (
							<Stack gap="md">
								<form onSubmit={onSubmit}>
									<Group mb="md" gap="sm">
										<Title order={2} mr="auto" fw={600} fz="lg">
											{"User information "}
										</Title>
										{!isEditing ? (
											<Button type="button" onClick={toggleEditing}>
												Edit
											</Button>
										) : (
											<>
												<Button
													type="submit"
													disabled={
														displayName === currentUser.displayName ||
														displayName === ""
													}
												>
													Save
												</Button>
												<Button
													variant="light"
													c="gray.7"
													type="button"
													onClick={toggleEditing}
												>
													Cancel
												</Button>
											</>
										)}
									</Group>
									<Group mb="xs" align="center">
										<Box
											component="span"
											miw="3.5rem"
											h={42}
											className="center-vertical"
										>
											Name
										</Box>
										{!isEditing ? (
											<Text px="md">{currentUser.displayName}</Text>
										) : (
											<TextInput
												id="display_name"
												name="display_name"
												type="text"
												defaultValue={currentUser.displayName ?? undefined}
												onChange={(e) => setDisplayName(e.target.value)}
												required
											/>
										)}
									</Group>
									<Group align="center">
										<Box
											component="span"
											miw="3.5rem"
											h={42}
											className="center-vertical"
										>
											Email
										</Box>
										<Text px="md">{currentUser.email}</Text>
									</Group>
								</form>
								{!currentUser.emailVerified && (
									<Text size="sm">
										{"Your email is unverified. "}
										<Link to="/account/verification" c="blue.5" fw={500}>
											Click here to verify your email
										</Link>
									</Text>
								)}
								<Button onClick={open} bg="red.7" w="fit-content">
									<IconTrash />
									<Box ml={8}>Delete account</Box>
								</Button>
								<Modal
									opened={opened}
									onClose={close}
									transitionProps={{ duration: 0 }}
									withCloseButton={false}
									centered
								>
									<Text mb="md" c="gray.7" size="lg">
										Are you sure you want to delete your account?
									</Text>
									<Group justify="end" gap="sm">
										<Button onClick={close} variant="light" c="gray.7">
											Cancel
										</Button>
										<Button onClick={onDelete} bg="red.7">
											Delete
										</Button>
									</Group>
								</Modal>
							</Stack>
						)}
					</>
				</Protected>
			</div>
		</Layout>
	);
}
