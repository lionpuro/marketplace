import { createUser, deleteUser, updateUser, upsertUser } from "./user.js";
import { getCategories } from "./category.js";
import {
	createListing,
	deleteListing,
	findListings,
	findListing,
	updateListing,
} from "./listing.js";

export const repository = {
	createUser,
	updateUser,
	upsertUser,
	deleteUser,
	getCategories,
	findListings,
	findListing,
	createListing,
	updateListing,
	deleteListing,
};
