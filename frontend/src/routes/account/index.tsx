import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type MouseEvent } from "react";
import { Protected } from "#/components/protected";
import { useAuth } from "#/auth/use-auth";
import { H1 } from "#/components/headings";
import { Modal } from "#/components/modal";
import { IconPencil, IconTrash } from "#/components/icons";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

export const Route = createFileRoute("/account/")({
	component: Component,
});

function Component() {
	const { currentUser, signOut } = useAuth();
	const [displayName, setDisplayName] = useState(
		currentUser?.displayName ?? "",
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const closeModal = () => setModalOpen(false);

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
			closeModal();
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
		<div className="flex flex-col grow gap-4 w-full max-w-screen-sm mx-auto">
			<H1>Account</H1>
			<Protected allowUnverified={true}>
				<>
					{currentUser && (
						<div className="flex flex-col gap-4">
							<form onSubmit={onSubmit} className="flex flex-col gap-4">
								<div className="flex gap-2">
									<h2 className="font-semibold text-lg mr-auto">
										{"User information "}
									</h2>
									{!isEditing ? (
										<button
											type="button"
											onClick={toggleEditing}
											className="flex items-center gap-2 bg-primary-400 text-base-50 pl-2 pr-3 py-0.5"
										>
											<IconPencil />
											Edit
										</button>
									) : (
										<>
											<button
												type="submit"
												className="bg-primary-400 disabled:bg-base-300 text-base-50 disabled:text-base-500 px-3 py-0.5"
												disabled={
													displayName === currentUser.displayName ||
													displayName === ""
												}
											>
												Save
											</button>
											<button
												type="button"
												onClick={toggleEditing}
												className="bg-base-400 text-base-50 px-3 py-0.5"
											>
												Cancel
											</button>
										</>
									)}
								</div>
								<div className="flex items-center">
									<label
										className="font-medium min-w-28"
										htmlFor="display_name"
									>
										Name
									</label>
									<input
										id="display_name"
										name="display_name"
										type="text"
										defaultValue={currentUser.displayName ?? undefined}
										onChange={(e) => setDisplayName(e.target.value)}
										disabled={!isEditing}
										className="py-0.5 px-1.5 border border-base-300 disabled:border-transparent grow"
										required
									/>
								</div>
								<div className="flex items-center">
									<label className="font-medium min-w-28" htmlFor="email">
										Email
									</label>
									<input
										id="email"
										name="email"
										type="text"
										defaultValue={currentUser.email ?? undefined}
										disabled={true}
										className="py-0.5 px-1.5 border border-base-300 disabled:border-transparent grow"
									/>
								</div>
							</form>
							{!currentUser.emailVerified && (
								<p className="text-sm text-base-600">
									{"Your email is unverified. "}
									<Link to="/account/verification" className="text-blue-500">
										Click here to verify your email
									</Link>
								</p>
							)}
							<button
								onClick={() => setModalOpen(true)}
								className="py-1.5 px-4 bg-red-600/80 text-base-50 w-fit mt-4 flex items-center gap-2"
							>
								<IconTrash />
								Delete account
							</button>
							<Modal isOpen={modalOpen} onClose={closeModal}>
								<div className="flex flex-col bg-base-100 p-8">
									<span className="text-lg font-medium text-base-800 w-full mb-8">
										Are you sure you want to delete your account?
									</span>
									<div className="flex justify-end gap-4">
										<button
											onClick={closeModal}
											className="py-1.5 px-4 font-medium bg-base-400 hover:bg-base-500 text-base-50"
										>
											Cancel
										</button>
										<button
											onClick={onDelete}
											className="py-1.5 px-4 font-medium bg-red-600/80 hover:bg-red-700/80 text-base-50"
										>
											Delete
										</button>
									</div>
								</div>
							</Modal>
						</div>
					)}
				</>
			</Protected>
		</div>
	);
}
