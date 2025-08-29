import { createFileRoute, Link } from "@tanstack/react-router";
import { titleCase } from "#/helpers";
import { useCategories } from "#/query/categories";

export const Route = createFileRoute("/")({
	component: Component,
});

function Component() {
	const { data: categories } = useCategories();
	return (
		<div className="flex flex-col max-w-screen-xl mx-auto w-full">
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
