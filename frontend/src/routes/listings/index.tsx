import { useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loading } from "#/components/loading";
import { titleCase } from "#/helpers";
import { useListings } from "#/query/listings";
import { useCategories } from "#/query/categories";
import { Select } from "#/components/select";
import { Listings } from "#/components/listings";
import { IconChevronDown } from "#/components/icons";
import type { Category, ListingsSortOption } from "backend";

type ListingsSearch = {
	category?: number;
	sort?: string;
};

function sortOption(s: string): ListingsSortOption {
	switch (s) {
		case "date|desc":
			return s;
		case "date|asc":
			return s;
		case "price|asc":
			return s;
		case "price|desc":
			return s;
		default:
			return "date|desc";
	}
}

export const Route = createFileRoute("/listings/")({
	validateSearch: (search: Record<string, unknown>): ListingsSearch => {
		const params: ListingsSearch = {
			sort: sortOption(typeof search.sort === "string" ? search.sort : ""),
		};
		if (search.category) {
			params.category = Number(search.category);
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
	const { category, sort } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { data: categories } = useCategories();
	const { data: listings, isLoading } = useListings({
		category: category,
		sort: sortOption(sort ?? ""),
	});
	const setSorting = (input: string) => {
		navigate({
			search: (prev) => ({ ...prev, sort: sortOption(input) }),
		});
	};
	return (
		<div className="flex flex-col max-w-screen-lg w-full mx-auto">
			<CategoriesMenu categories={categories} />
			<h1 className="w-full font-bold text-3xl mb-8 min-h-9">
				{!category
					? "All listings"
					: titleCase(categories?.find((c) => c.id === category)?.name ?? "")}
			</h1>
			<div className="flex flex-col sm:flex-row">
				<div className="max-sm:hidden min-w-38 flex flex-wrap sm:flex-col gap-x-4 sm:gap-x-6 max-sm:px-2 max-sm:min-h-9 mr-8">
					<h2 className="flex items-center font-semibold h-9">Categories</h2>
					{categories?.map((c) => (
						<Link
							key={c.id}
							to="/listings"
							search={{ category: c.id, sort: sort }}
							className="py-2 sm:py-1.5 text-primary-600 text-sm font-medium hover:underline underline-offset-2"
						>
							{titleCase(c.name)}
						</Link>
					))}
				</div>
				<div className="flex flex-col gap-4 grow">
					<div className="flex items-center">
						<span className="font-medium text-neutral-600">
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
								setSorting(e.target.value);
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
	const detailsRef = useRef<HTMLDetailsElement>(null);
	const summaryRef = useRef<HTMLElement>(null);
	const close = () => detailsRef.current?.open && summaryRef.current?.click();

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
			}
		};
		const onClick = (e: MouseEvent) => {
			if (!detailsRef.current) {
				return;
			}
			const rect = detailsRef.current.getBoundingClientRect();
			const outside =
				e.clientX < rect.left ||
				e.clientX > rect.right ||
				e.clientY < rect.top ||
				e.clientY > rect.bottom;
			if (outside) {
				close();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		document.body.addEventListener("click", onClick);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.removeEventListener("click", onClick);
		};
	}, []);

	return (
		<details ref={detailsRef} className="relative sm:hidden">
			<summary
				ref={summaryRef}
				className="cursor-pointer list-none select-none flex items-center gap-1 py-1.5"
			>
				Categories
				<IconChevronDown size="18" />
			</summary>
			<div className="absolute left-0 bg-white border border-neutral-200 flex flex-col">
				{categories?.map((c) => (
					<Link
						key={c.id}
						to="/listings"
						search={{ category: c.id }}
						onClick={close}
						className="whitespace-nowrap px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-200/50 text-sm font-medium"
					>
						{titleCase(c.name)}
					</Link>
				))}
			</div>
		</details>
	);
};
