import { useAuth } from "#/auth/use-auth";
import FormError from "#/components/form-error";
import { IconTrash } from "#/components/icons";
import Input from "#/components/input";
import { Loading } from "#/components/loading";
import { Protected } from "#/components/protected";
import { Select } from "#/components/select";
import { formatPrice, titleCase } from "#/helpers";
import { useLocation } from "#/hooks/use-location";
import { useCategories } from "#/query/categories";
import {
	useDeleteListing,
	useListing,
	useUpdateListing,
} from "#/query/listings";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Category, Listing, UpdateListingBody } from "backend";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

export const Route = createFileRoute("/listings/$id")({
	component: Component,
});

type Inputs = {
	category: number;
	title: string;
	description?: string;
	price: number;
	country: string;
	state?: string;
	city?: number;
};

function Component() {
	const { id } = Route.useParams();
	const { currentUser } = useAuth();
	const { data: listing, isLoading } = useListing(Number(id));
	const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();
	const [editing, setEditing] = useState(false);

	const { data: categories } = useCategories();

	const { mutate: updateListing, isPending } = useUpdateListing();

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		if (!listing) return;
		data.price = Math.trunc(data.price * 100);
		const body: UpdateListingBody = {
			category_id: data.category,
			title: data.title,
			description: data.description,
			price: data.price,
			country_code: data.country,
			state_code: data.state,
			city: data.city,
		};
		updateListing({ id: listing.id, listing: body });
		setEditing(false);
	};
	if (isLoading) {
		return <Loading />;
	}
	if (!listing) {
		return "Listing not found";
	}
	return (
		<div className="flex flex-col grow gap-4 w-full max-w-screen-sm mx-auto">
			<div className="flex">
				<Link to="/listings" className="text-neutral-800 hover:underline">
					Listings
				</Link>
				<span className="text-neutral-400 mx-2">/</span>
				<Link
					to="/listings"
					search={{ category: listing.category.id }}
					className="text-neutral-800 hover:underline"
				>
					{titleCase(listing.category.name)}
				</Link>
			</div>
			{!editing ? (
				<div className="flex flex-col max-w-sm gap-2">
					<h1 className="text-3xl font-semibold">{listing.title}</h1>
					<span className="text-xl font-semibold">
						{formatPrice(listing.price)}
					</span>
					{currentUser && currentUser.uid === listing.seller_id && (
						<button
							onClick={() => setEditing(true)}
							className="bg-primary-500 text-neutral-50 py-1 px-4 min-w-36 mb-2 mt-2"
						>
							Edit
						</button>
					)}
					<p className="pt-2 border-t border-neutral-200 text-neutral-800 whitespace-pre">
						{listing.description}
					</p>
				</div>
			) : (
				<Protected>
					<div className="flex flex-col grow w-full max-w-screen-sm mx-auto">
						<EditForm
							categories={categories}
							listing={listing}
							onSubmit={onSubmit}
							onCancel={() => setEditing(false)}
							isSubmitting={isPending}
						/>
					</div>
					{currentUser?.uid === listing.seller_id && (
						<button
							disabled={isDeleting}
							onClick={() => deleteListing(listing.id)}
							className="ml-auto flex items-center gap-2 p-2 text-red-600/90"
						>
							<IconTrash />
							Delete
						</button>
					)}
				</Protected>
			)}
		</div>
	);
}

function EditForm({
	categories,
	listing,
	onSubmit,
	onCancel,
	isSubmitting,
}: {
	categories?: Category[];
	listing: Listing;
	onSubmit: SubmitHandler<Inputs>;
	onCancel: () => void;
	isSubmitting: boolean;
}) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		setValue,
	} = useForm<Inputs>({
		mode: "onChange",
		defaultValues: {
			category: listing.category.id,
			title: listing.title,
			description: listing.description ?? undefined,
			price: listing.price / 100,
			country: listing.country_code,
			state: listing.state_code ?? undefined,
			city: listing.city ?? undefined,
		},
	});
	const [country, state, city] = watch(["country", "state", "city"]);
	const {
		data: { countries, states, cities },
	} = useLocation({ country, state, city });

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
			<div className="flex gap-2">
				<h1 className="text-xl font-semibold">Edit listing</h1>
				<button
					type="submit"
					className="ml-auto bg-primary-500 text-neutral-50 disabled:bg-neutral-200 disabled:text-neutral-400 py-1 px-4"
					disabled={!isValid || isSubmitting}
				>
					Save
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						onCancel();
					}}
					className="bg-neutral-400 text-neutral-50 py-1 px-4"
				>
					Cancel
				</button>
			</div>
			<label htmlFor="category">Category</label>
			<Select
				{...register("category", {
					valueAsNumber: true,
					required: "Required",
					validate: (val) => (isNaN(val) ? "Required" : true),
				})}
			>
				<option value="">{!categories ? "--" : "Select category"}</option>
				{categories?.map((c) => (
					<option key={c.id} value={c.id}>
						{c.name[0].toUpperCase() + c.name.slice(1)}
					</option>
				))}
			</Select>
			<FormError message={errors.category?.message} />
			<label htmlFor="title">Title</label>
			<Input
				{...register("title", {
					required: "Required",
					validate: (val) => {
						if (val.replaceAll(" ", "") === "") {
							return "Required";
						}
						return true;
					},
				})}
				className="bg-white"
			/>
			<FormError message={errors.title?.message} />
			<label htmlFor="description">Description</label>
			<textarea
				{...register("description")}
				rows={3}
				className="p-3 field-sizing-content bg-white border border-neutral-200"
			/>
			<label htmlFor="price">Price</label>
			<span className="w-fit relative after:absolute after:right-2 after:top-1/2 after:translate-y-[-50%] after:content-['€'] after:text-neutral-800 after:font-medium">
				<Input
					{...register("price", {
						valueAsNumber: true,
						validate: (val) => {
							if (isNaN(val)) {
								return "Invalid price";
							}
							return true;
						},
						required: "Required",
					})}
					inputMode="numeric"
					className="bg-white pr-5 w-36"
				/>
			</span>
			<FormError message={errors.price?.message} />
			<label htmlFor="country">Country</label>
			{countries ? (
				<Select
					{...register("country", {
						onChange: () => {
							setValue("state", undefined);
							setValue("city", undefined);
						},
						disabled: !countries,
						required: "Required",
					})}
				>
					<option value="">--</option>
					{countries?.map((country) => (
						<option key={country.id} value={country.iso2 ?? undefined}>
							{country.name}
						</option>
					))}
				</Select>
			) : (
				<Select disabled>
					<option disabled value="">
						--
					</option>
				</Select>
			)}
			<FormError message={errors.country?.message} />
			<label htmlFor="state">State</label>
			{states ? (
				<Select
					{...register("state", {
						onChange: () => {
							setValue("city", undefined);
						},
						disabled: !states || states.length === 0,
						required: states && states.length > 0 ? "Required" : false,
					})}
				>
					<option value="">
						{states && states.length === 0 ? "No states" : "--"}
					</option>
					{states?.map((state) => (
						<option key={state.id} value={state.iso2 ?? undefined}>
							{state.name}
						</option>
					))}
				</Select>
			) : (
				<Select disabled>
					<option disabled value="">
						--
					</option>
				</Select>
			)}
			<FormError message={errors.state?.message} />
			<label htmlFor="city">City</label>
			{cities ? (
				<Select
					{...register("city", {
						required: cities && cities.length > 0 ? "Required" : false,
						disabled: !cities || cities.length === 0,
					})}
				>
					<option value="">
						{(states && states.length === 0) || (cities && cities.length === 0)
							? "No cities"
							: "--"}
					</option>
					{cities?.map((city) => (
						<option key={city.id} value={city.id}>
							{city.name}
						</option>
					))}
				</Select>
			) : (
				<Select disabled>
					<option disabled value="">
						--
					</option>
				</Select>
			)}
			<FormError message={errors.city?.message} />
		</form>
	);
}
