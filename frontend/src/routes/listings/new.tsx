import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormError from "#/components/form-error";
import { Protected } from "#/components/protected";
import { useLocation } from "#/hooks/use-location";
import { useCreateListing } from "#/query/listings";
import { useCategories } from "#/query/categories";
import type { NewListingBody } from "backend";
import {
	Title,
	NativeSelect,
	Input,
	Button,
	InputLabel,
	Textarea,
	type InputLabelProps,
	Stack,
	Container,
} from "@mantine/core";
import { Layout } from "#/components/layout";

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
	city?: number;
};

function Component() {
	const { data: categories, isLoading: loadingCategories } = useCategories();
	const { mutate: createListing, isPending, isSuccess } = useCreateListing();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		setValue,
	} = useForm<Inputs>({ mode: "onChange" });
	const [country, state, city] = watch(["country", "state", "city"]);

	const {
		data: { countries, states, cities },
	} = useLocation({ country, state, city });

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
		createListing(body);
	};
	const labelProps: InputLabelProps = {
		size: "md",
		mt: "md",
	};

	if (isSuccess) {
		return <Navigate to="/" />;
	}
	return (
		<Layout>
			<Protected>
				<Container size="sm" w="100%">
					<Title order={1}>New listing</Title>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack gap={4}>
							<InputLabel htmlFor="category" {...labelProps}>
								Category
							</InputLabel>
							<NativeSelect
								{...register("category", {
									valueAsNumber: true,
									required: "Required",
									validate: (val) => (isNaN(val) ? "Required" : true),
								})}
							>
								<option value="">
									{loadingCategories ? "--" : "Select category"}
								</option>
								{categories?.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name[0].toUpperCase() + c.name.slice(1)}
									</option>
								))}
							</NativeSelect>
							<FormError message={errors.category?.message} />
							<InputLabel htmlFor="title" {...labelProps}>
								Title
							</InputLabel>
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
							/>
							<FormError message={errors.title?.message} />
							<InputLabel htmlFor="description" {...labelProps}>
								Description
							</InputLabel>
							<Textarea
								{...register("description")}
								size="md"
								resize="vertical"
								rows={3}
							/>
							<InputLabel htmlFor="price" {...labelProps}>
								Price
							</InputLabel>
							<Input
								rightSection={"€"}
								rightSectionProps={{ color: "gray.7" }}
								w={144}
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
							/>
							<FormError message={errors.price?.message} />
							<InputLabel htmlFor="country" {...labelProps}>
								Country
							</InputLabel>
							<NativeSelect
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
							</NativeSelect>
							<FormError message={errors.country?.message} />
							<InputLabel htmlFor="state" {...labelProps}>
								State
							</InputLabel>
							<NativeSelect
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
							</NativeSelect>
							<FormError message={errors.state?.message} />
							<InputLabel htmlFor="city" {...labelProps}>
								City
							</InputLabel>
							<NativeSelect
								{...register("city", {
									valueAsNumber: true,
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
							</NativeSelect>
							<FormError message={errors.city?.message} />
							<Button type="submit" mt="xl" disabled={!isValid || isPending}>
								Submit
							</Button>
						</Stack>
					</form>
				</Container>
			</Protected>
		</Layout>
	);
}
