import { createUser, deleteUser, updateUser, upsertUser } from "./user.js";
import { getCategories } from "./category.js";
import { createListing } from "./listing.js";

export const repository = {
	createUser,
	updateUser,
	upsertUser,
	deleteUser,
	getCategories,
	createListing,
};
