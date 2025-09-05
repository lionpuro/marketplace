import css from "./listings.module.css";
import { formatPrice, localDate } from "#/helpers";
import type { Listing } from "backend";
import { Box, Center, Flex, Stack, Text, Title } from "@mantine/core";
import { Link } from "#/components/link";
import { IconImage } from "#/components/icons";

export const Listings = ({ listings }: { listings?: Listing[] }) => (
	<Stack className={css.list} my="md">
		{listings?.map((listing) => (
			<Link
				key={listing.id}
				to="/listings/$id"
				params={{ id: listing.id.toString() }}
				c="black"
				className={css.item}
			>
				<Box h="8rem" w="8rem" bg="gray.1" c="gray.5">
					<Center h="100%" w="100%">
						<IconImage size="32" />
					</Center>
				</Box>
				<Flex direction="column" style={{ flexGrow: 1 }} px="md">
					<Title order={3} size="md" fw={500}>
						{listing.title}
					</Title>
					<Text fw={600} size="xl">
						{formatPrice(listing.price)}
					</Text>
					<Flex justify="space-between" mt="auto">
						<span>
							{`${listing.location.country_emoji ?? ""} ${listing.location.country ?? ""}`}
						</span>
						<Text c="base.6" size="sm">
							{localDate(listing.created_at)}
						</Text>
					</Flex>
				</Flex>
			</Link>
		))}
	</Stack>
);
