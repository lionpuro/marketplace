import { useAuth } from "#/auth/use-auth";
import FormError from "#/components/form-error";
import { IconImage, IconTrash } from "#/components/icons";
import { LoadingPage } from "#/components/loading";
import { Protected } from "#/components/protected";
import {
	Box,
	Button,
	Center,
	Container,
	Divider,
	Flex,
	Group,
	Input,
	InputLabel,
	NativeSelect,
	Stack,
	Text,
	Textarea,
	Title,
	type InputLabelProps,
} from "@mantine/core";
import { formatPrice, localDate, titleCase } from "#/helpers";
import { useLocation } from "#/hooks/use-location";
import { useCategories } from "#/query/categories";
import {
	useDeleteListing,
	useListing,
	useUpdateListing,
} from "#/query/listings";
import { createFileRoute } from "@tanstack/react-router";
import type { Category, Listing, UpdateListingBody } from "backend";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Layout } from "#/components/layout";
import { Link } from "#/components/link";

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
		return <LoadingPage />;
	}
	if (!listing) {
		return <Layout>Listing not found</Layout>;
	}
	return (
		<Layout>
			<div>
				{!editing ? (
					<>
						<Group display="flex" gap={6} mb="xl">
							<Link to="/listings" c="base.8">
								Listings
							</Link>
							<Text c="base.4">/</Text>
							<Link
								to="/listings"
								search={{ category: listing.category.id }}
								c="base.8"
							>
								{titleCase(listing.category.name)}
							</Link>
						</Group>
						<Flex
							direction={{ base: "column", sm: "row" }}
							gap="2rem"
							wrap="wrap"
						>
							<Box flex={{ sm: "0 1 50%" }} h={300} bg="gray.1" c="gray.5">
								<Center h="100%" w="100%">
									<IconImage size="48" />
								</Center>
							</Box>
							<Flex direction="column" gap="0.5rem" flex="1">
								<Title order={1}>{listing.title}</Title>
								<Box fz={24} fw={600}>
									{formatPrice(listing.price)}
								</Box>
								{currentUser && currentUser.uid === listing.seller_id && (
									<Button my={8} onClick={() => setEditing(true)}>
										Edit
									</Button>
								)}
								<Divider />
								<Text mt={8} style={{ whiteSpace: "pre" }}>
									{listing.description}
								</Text>
								<Text mt={8}>
									{[
										listing.location.city,
										listing.location.state,
										listing.location.country,
									]
										.filter((s) => s !== null)
										.join(", ")}
								</Text>
								<Divider />
								<Text c="gray.6" size="sm">
									Listed {localDate(listing.created_at)}
								</Text>
							</Flex>
						</Flex>
					</>
				) : (
					<Protected>
						<Container size="sm" w="100%">
							<Stack>
								<EditForm
									categories={categories}
									listing={listing}
									onSubmit={onSubmit}
									onCancel={() => setEditing(false)}
									isSubmitting={isPending}
								/>
								{currentUser?.uid === listing.seller_id && (
									<Button
										disabled={isDeleting}
										onClick={() => deleteListing(listing.id)}
										variant="transparent"
										c="red"
										mt="md"
										ml="auto"
									>
										<IconTrash />
										<Text ml="xs"> Delete </Text>
									</Button>
								)}
							</Stack>
						</Container>
					</Protected>
				)}
			</div>
		</Layout>
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
			country: listing.location.country_code ?? undefined,
			state: listing.location.state_code ?? undefined,
			city: listing.location.city_id ?? undefined,
		},
	});
	const [country, state, city] = watch(["country", "state", "city"]);
	const {
		data: { countries, states, cities },
	} = useLocation({ country, state, city });

	const labelProps: InputLabelProps = {
		size: "md",
		mt: "md",
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Group mb="md">
				<Title order={1}>Edit listing</Title>
				<Button ml="auto" type="submit" disabled={!isValid || isSubmitting}>
					Save
				</Button>
				<Button
					variant="light"
					type="button"
					onClick={(e) => {
						e.preventDefault();
						onCancel();
					}}
				>
					Cancel
				</Button>
			</Group>
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
					<option value="">{!categories ? "--" : "Select category"}</option>
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
				<Textarea size="md" {...register("description")} rows={3} />
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
				{countries ? (
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
				) : (
					<NativeSelect disabled>
						<option disabled value="">
							--
						</option>
					</NativeSelect>
				)}
				<FormError message={errors.country?.message} />
				<InputLabel htmlFor="state" {...labelProps}>
					State
				</InputLabel>
				{states ? (
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
				) : (
					<NativeSelect disabled>
						<option disabled value="">
							--
						</option>
					</NativeSelect>
				)}
				<FormError message={errors.state?.message} />
				<InputLabel htmlFor="city" {...labelProps}>
					City
				</InputLabel>
				{cities ? (
					<NativeSelect
						{...register("city", {
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
				) : (
					<NativeSelect disabled>
						<option disabled value="">
							--
						</option>
					</NativeSelect>
				)}
				<FormError message={errors.city?.message} />
			</Stack>
		</form>
	);
}
