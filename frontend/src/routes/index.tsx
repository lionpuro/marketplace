import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { titleCase } from "#/helpers";
import { useCategories } from "#/query/categories";
import { SearchBar } from "#/components/searchbar";

export const Route = createFileRoute("/")({
	component: Component,
});

function Component() {
	const { data: categories } = useCategories();
	const navigate = useNavigate();
	const onSearch = (query?: string) => {
		navigate({
			to: "/listings",
			search: (prev) => ({ ...prev, q: query ? query : undefined }),
		});
	};
	return (
		<div className="flex flex-col max-w-screen-xl mx-auto w-full">
			<SearchBar
				onSubmit={onSearch}
				className="max-w-screen-sm mx-auto w-full mb-4"
			/>
			<h2 className="text-xl font-semibold mb-4 text-center">
				Browse by category
			</h2>
			<div className="flex flex-wrap justify-center gap-2 max-w-screen-sm mx-auto">
				{categories?.map((c) => (
					<Link
						key={c.id}
						to="/listings"
						search={{ category: c.id }}
						className="bg-primary-200/80 hover:bg-primary-200 text-primary-700 py-1.5 px-3"
					>
						{titleCase(c.name)}
					</Link>
				))}
			</div>
		</div>
	);
}
