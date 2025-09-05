import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "#/components/link";
import { Loading } from "#/components/loading";
import { titleCase } from "#/helpers";
import { useListings } from "#/query/listings";
import { useCategories } from "#/query/categories";
import { Listings } from "#/components/listings";
import { IconFilter, IconX } from "#/components/icons";
import type { ListingsSortOption } from "backend";
import {
	Button,
	Flex,
	Title,
	NativeSelect,
	Text,
	ActionIcon,
	Box,
	Group,
} from "@mantine/core";
import { Layout } from "#/components/layout";
import { useMobile } from "#/hooks/use-mobile";
import { useState } from "react";

type ListingsSearch = {
	category?: number;
	sort?: ListingsSortOption;
	q?: string;
};

function isSortOption(input: unknown): input is ListingsSortOption {
	if (typeof input !== "string") {
		return false;
	}
	switch (input) {
		case "date|desc":
		case "date|asc":
		case "price|asc":
		case "price|desc":
			return true;
	}
	return false;
}

export const Route = createFileRoute("/listings/")({
	validateSearch: (search: Record<string, unknown>): ListingsSearch => {
		const params: ListingsSearch = {};
		if (search.category) {
			params.category = Number(search.category);
		}
		params.sort = isSortOption(search.sort) ? search.sort : "date|desc";
		if (search.q && typeof search.q === "string") {
			params.q = search.q;
		}
		return params;
	},
	component: Component,
});

const sortOptions: { value: ListingsSortOption; label: string }[] = [
	{ value: "date|desc", label: "Time: Most recent" },
	{ value: "date|asc", label: "Time: Oldest" },
	{ value: "price|asc", label: "Price: Low to high" },
	{ value: "price|desc", label: "Price: High to low" },
];

function Component() {
	const { category, sort, q } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const isMobile = useMobile();
	const { data: categories } = useCategories();
	const { data: listings, isLoading } = useListings({
		category: category,
		sort: sort,
		q: q,
	});
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const setSorting = (input: ListingsSortOption) => {
		navigate({
			search: (prev) => ({ ...prev, sort: input }),
		});
	};
	const sidebar = (
		<>
			<Flex justify="space-between" align="center" hiddenFrom="sm" py="md">
				<Text fw="bold" size="xl">
					{"Filter"}
				</Text>
				<Button
					size="compact-md"
					variant="transparent"
					c="black"
					px={0}
					onClick={() => setSidebarOpen(false)}
				>
					<IconX size="24" />
				</Button>
			</Flex>
			<Flex direction="column">
				<Title order={2} size="md" mb="xs" px="xs">
					Categories
				</Title>
				<Link
					to="/listings"
					search={(prev) => ({ ...prev, category: undefined })}
					c={!category ? "juniper.6" : "base.9"}
					fw={!category ? 500 : undefined}
					py="3"
					px="xs"
					bg={!category ? "juniper.1" : "transparent"}
				>
					All categories
				</Link>
				{categories?.map((c) => (
					<Link
						key={c.id}
						to="/listings"
						search={(prev) => ({ ...prev, category: c.id })}
						c={category === c.id ? "juniper.6" : "base.9"}
						fw={category === c.id ? 500 : undefined}
						py="3"
						px="xs"
						bg={category === c.id ? "juniper.1" : "transparent"}
					>
						{titleCase(c.name)}
					</Link>
				))}
			</Flex>
		</>
	);
	const title = (
		<Title order={1} display="flex" fz={28} style={{ whiteSpace: "pre" }}>
			{listings ? (
				<>
					{`${listings.length} results`}
					<Box my="auto" ml={0} fw={500} c="base.10">
						{q ? ` for "${q}"` : ""}
					</Box>
				</>
			) : (
				<Box c="transparent">0 results</Box>
			)}
		</Title>
	);
	return (
		<Layout sidebar={sidebar} sidebarOpen={sidebarOpen} query={q}>
			<Flex direction="column" flex={1} w="100%" p={0}>
				{isMobile && title}
				<Group align="center" my="md">
					{isMobile ? (
						<ActionIcon
							hiddenFrom="sm"
							size="input-md"
							onClick={() => setSidebarOpen(true)}
						>
							<IconFilter size="24" />
						</ActionIcon>
					) : (
						title
					)}
					<Group align="center" ml="auto">
						<Text size="sm" fw={500} c="gray.7" ml="auto">
							Sort by
						</Text>
						<NativeSelect
							id="sort"
							name="sort"
							value={sort}
							onChange={(e) => {
								const v = e.target.value;
								setSorting(isSortOption(v) ? v : "date|desc");
								e.target.blur();
							}}
							size="md"
						>
							{sortOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</NativeSelect>
					</Group>
				</Group>
				{isLoading ? (
					<Flex justify="center" align="center" h="100%" flex={1}>
						<Loading />
					</Flex>
				) : (
					<Listings listings={listings} />
				)}
			</Flex>
		</Layout>
	);
}
