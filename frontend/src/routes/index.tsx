import { createFileRoute } from "@tanstack/react-router";
import { titleCase } from "#/helpers";
import { useCategories } from "#/query/categories";
import { Layout } from "#/components/layout";
import { Link } from "#/components/link";
import { Center, Flex, Title } from "@mantine/core";

export const Route = createFileRoute("/")({
	component: Component,
});

function Component() {
	const { data: categories } = useCategories();
	return (
		<Layout>
			<Center>
				<Title order={2} size="xl" mb="sm">
					Browse by category
				</Title>
			</Center>
			<Center>
				<Flex gap={4} wrap="wrap" justify="center" maw={720}>
					{categories?.map((c) => (
						<Link
							key={c.id}
							to="/listings"
							search={{ category: c.id }}
							py="xs"
							px="md"
							c="white"
							fw={500}
							size="sm"
							bg="juniper.4"
						>
							{titleCase(c.name)}
						</Link>
					))}
				</Flex>
			</Center>
		</Layout>
	);
}
