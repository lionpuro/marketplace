import { createUser, deleteUser, updateUser, upsertUser } from "./user.js";

export const repository = {
	createUser,
	updateUser,
	upsertUser,
	deleteUser,
};
