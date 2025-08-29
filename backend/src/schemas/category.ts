import { Type } from "@sinclair/typebox";
import { Nullable } from "./index.js";

export const CategorySchema = Type.Object({
	id: Type.Number(),
	name: Type.String(),
	parent_id: Nullable(Type.Number()),
});
