import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Protected } from "#/components/protected";
import { useAuth } from "#/auth/use-auth";
import { H1 } from "#/components/headings";
import { Modal } from "#/components/modal";
import { IconTrash } from "#/components/icons";

export const Route = createFileRoute("/account/")({
	component: Component,
});

function Component() {
	const { currentUser, signOut } = useAuth();
	const [modalOpen, setModalOpen] = useState(false);
	const closeModal = () => setModalOpen(false);
	const onDelete = async () => {
		if (!currentUser) {
			return;
		}
		try {
			const token = await currentUser.getIdToken();
			const url = `${import.meta.env.VITE_API_BASE_URL}/users/${currentUser.uid}`;
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
		}
	};
	return (
		<div className="flex flex-col grow gap-8 w-full max-w-screen-sm mx-auto">
			<H1>Account</H1>
			<Protected allowUnverified={true}>
				<>
					{currentUser && (
						<div className="flex flex-col gap-4">
							<h2 className="font-semibold text-lg"> User information </h2>
							<div className="flex">
								<h3 className="font-medium min-w-36"> Name </h3>
								<span>{currentUser.displayName}</span>
							</div>
							<div className="flex">
								<h3 className="font-medium min-w-36"> Email </h3>
								<span>{currentUser.email}</span>
							</div>
							{!currentUser.emailVerified && (
								<p className="text-sm text-neutral-600">
									{"Your email is unverified. "}
									<Link to="/account/verification" className="text-blue-500">
										Click here to verify your email
									</Link>
								</p>
							)}
							<button
								onClick={() => setModalOpen(true)}
								className="py-1.5 px-4 bg-red-600/80 text-neutral-50 w-fit mt-4 flex items-center gap-2"
							>
								<IconTrash />
								Delete account
							</button>
							<Modal isOpen={modalOpen} onClose={closeModal}>
								<div className="flex flex-col bg-neutral-100 p-8">
									<span className="text-lg font-medium text-neutral-800 w-full mb-8">
										Are you sure you want to delete your account?
									</span>
									<div className="flex justify-end gap-4">
										<button
											onClick={closeModal}
											className="py-1.5 px-4 font-medium bg-neutral-400 hover:bg-neutral-500 text-neutral-50"
										>
											Cancel
										</button>
										<button
											onClick={onDelete}
											className="py-1.5 px-4 font-medium bg-red-600/80 hover:bg-red-700/80 text-neutral-50"
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
