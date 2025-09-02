import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loading } from "#/components/loading";
import { titleCase } from "#/helpers";
import { useListings } from "#/query/listings";
import { useCategories } from "#/query/categories";
import { Select } from "#/components/select";
import { Listings } from "#/components/listings";
import { IconChevronDown } from "#/components/icons";
import type { Category, ListingsSortOption } from "backend";
import { SearchBar } from "#/components/searchbar";
import { Dropdown } from "#/components/dropdown";

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
	const { data: categories } = useCategories();
	const { data: listings, isLoading } = useListings({
		category: category,
		sort: sort,
		q: q,
	});
	const setSorting = (input: ListingsSortOption) => {
		navigate({
			search: (prev) => ({ ...prev, sort: input }),
		});
	};
	const onSearch = (query?: string) => {
		navigate({
			to: "/listings",
			search: (prev) => ({ ...prev, q: query ? query : undefined }),
		});
	};
	return (
		<div className="flex flex-col max-w-screen-lg w-full mx-auto">
			<CategoriesMenu categories={categories} />
			<div className="flex flex-col sm:flex-row sm:items-center mb-8">
				<h1 className="w-full font-bold text-3xl min-h-9 max-sm:mb-4">
					{!category
						? "All listings"
						: titleCase(categories?.find((c) => c.id === category)?.name ?? "")}
				</h1>
				<SearchBar
					onSubmit={onSearch}
					onClear={() => onSearch(undefined)}
					defaultValue={q}
					className="sm:max-w-screen-sm mx-auto w-full"
				/>
			</div>
			<div className="flex flex-col sm:flex-row">
				<div className="max-sm:hidden min-w-38 flex flex-wrap sm:flex-col gap-x-4 sm:gap-x-6 max-sm:px-2 max-sm:min-h-9 mr-8">
					<h2 className="flex items-center font-semibold h-9">Categories</h2>
					<Link
						to="/listings"
						search={(prev) => ({ ...prev, category: undefined })}
						className={`relative py-1.5 text-primary-600 text-sm font-medium hover:underline underline-offset-2 ${!category ? "before:content-['✔'] before:absolute before:-left-5 before:text-primary-800" : ""}`}
					>
						All categories
					</Link>
					{categories?.map((c) => (
						<Link
							key={c.id}
							to="/listings"
							search={(prev) => ({ ...prev, category: c.id })}
							className={`relative py-1.5 text-primary-600 text-sm font-medium hover:underline underline-offset-2 ${category === c.id ? "before:content-['✔'] before:absolute before:-left-5 before:text-primary-800" : ""}`}
						>
							{titleCase(c.name)}
						</Link>
					))}
				</div>
				<div className="flex flex-col gap-4 grow">
					<div className="flex items-center">
						<span className="font-medium text-base-600">
							{listings ? `${listings.length} Results` : ""}
						</span>
						<label htmlFor="sort" className="mr-2 ml-auto">
							Sort:
						</label>
						<Select
							id="sort"
							name="sort"
							value={sort}
							onChange={(e) => {
								const v = e.target.value;
								setSorting(isSortOption(v) ? v : "date|desc");
								e.target.blur();
							}}
						>
							{sortOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</Select>
					</div>
					{isLoading ? <Loading /> : <Listings listings={listings} />}
				</div>
			</div>
		</div>
	);
}

const CategoriesMenu = ({ categories }: { categories?: Category[] }) => {
	return (
		<Dropdown
			label={
				<>
					Categories
					<IconChevronDown size="18" />
				</>
			}
			className="sm:hidden"
		>
			<Link
				to="/listings"
				search={(prev) => ({ ...prev, category: undefined })}
				onClick={close}
				className="whitespace-nowrap px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-200/50 text-sm font-medium"
			>
				All categories
			</Link>
			{categories?.map((c) => (
				<Link
					key={c.id}
					to="/listings"
					search={(prev) => ({ ...prev, category: c.id })}
					onClick={close}
					className="whitespace-nowrap px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-200/50 text-sm font-medium"
				>
					{titleCase(c.name)}
				</Link>
			))}
		</Dropdown>
	);
};
