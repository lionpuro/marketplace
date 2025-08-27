import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormError from "#/components/form-error";
import { H1 } from "#/components/headings";
import Input from "#/components/input";
import { Protected } from "#/components/protected";
import { useLocation } from "#/hooks/use-location";
import { useCreateListing } from "#/query/listings";
import { useCategories } from "#/query/categories";
import type { NewListingBody } from "backend";
import { Select } from "#/components/select";

export const Route = createFileRoute("/listings/new")({
	component: Component,
});

type Inputs = {
	category: number;
	title: string;
	description?: string;
	price: number;
	country: string;
	state?: string;
	city?: string;
};

function Component() {
	const {
		location,
		setLocation,
		data: { countries, states, cities },
	} = useLocation();

	const { data: categories, isLoading: loadingCategories } = useCategories();

	const { mutate, isPending, isSuccess } = useCreateListing();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		data.price = Math.trunc(data.price * 100);
		const body: NewListingBody = {
			category_id: data.category,
			title: data.title,
			description: data.description,
			price: data.price,
			country_code: data.country,
			state_code: data.state,
			city: data.city,
		};
		mutate(body);
	};

	if (isSuccess) {
		return <Navigate to="/" />;
	}
	return (
		<Protected>
			<div className="flex flex-col grow w-full max-w-screen-sm mx-auto">
				<H1>New listing</H1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
					<label htmlFor="category">Category</label>
					<Select
						{...register("category", {
							valueAsNumber: true,
							disabled: loadingCategories,
							required: "Required",
						})}
					>
						<option disabled value="">
							--
						</option>
						{categories?.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name[0].toUpperCase() + c.name.slice(1)}
							</option>
						))}
					</Select>
					<FormError message={errors.category?.message} />
					<label htmlFor="title">Title</label>
					<Input
						{...register("title", { required: "Required" })}
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
					<Select
						{...register("country", {
							value: location.country ?? "",
							onChange: (e) => setLocation({ country: e.target.value }),
							disabled: !countries,
							required: "Required",
						})}
					>
						<option disabled value="">
							--
						</option>
						{countries?.map((country) => (
							<option key={country.id} value={country.iso2}>
								{country.name}
							</option>
						))}
					</Select>
					<FormError message={errors.country?.message} />
					<label htmlFor="state">State</label>
					<Select
						{...register("state", {
							value: location.state ?? "",
							onChange: (e) => {
								setLocation({
									...location,
									state: e.target.value,
									city: undefined,
								});
							},
							disabled: !states || states.length === 0,
							required: states && states.length > 0 ? "Required" : false,
						})}
					>
						<option value="">
							{states && states.length === 0 ? "No states" : "--"}
						</option>
						{states?.map((state) => (
							<option key={state.id} value={state.iso2}>
								{state.name}
							</option>
						))}
					</Select>
					<FormError message={errors.state?.message} />
					<label htmlFor="city">City</label>
					<Select
						{...register("city", {
							value: location.city ?? "",
							onChange: (e) =>
								setLocation({ ...location, city: e.target.value }),
							required: cities && cities.length > 0 ? "Required" : false,
							disabled: !cities || cities.length === 0,
						})}
					>
						<option value="">
							{(states && states.length === 0) ||
							(cities && cities.length === 0)
								? "No cities"
								: "--"}
						</option>
						{cities?.map((city) => (
							<option key={city.id} value={city.id}>
								{city.name}
							</option>
						))}
					</Select>
					<FormError message={errors.city?.message} />
					<button
						type="submit"
						className="mt-4 bg-primary-400 text-neutral-50 disabled:bg-neutral-200 disabled:text-neutral-400 py-1.5"
						disabled={!isValid || isPending}
					>
						Submit
					</button>
				</form>
			</div>
		</Protected>
	);
}
