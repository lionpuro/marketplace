import css from "./searchbar.module.css";
import { useState, type KeyboardEvent } from "react";
import { IconSearch, IconX } from "#/components/icons";
import { ActionIcon, Button, Flex, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { breakpoints } from "#/theme";

type Props = {
	defaultValue?: string;
	onSubmit: (query?: string) => void;
	onClear?: () => void;
	maxWidth?: number;
};

export const SearchBar = ({
	defaultValue,
	onSubmit,
	onClear,
	maxWidth,
}: Props) => {
	const [query, setQuery] = useState(defaultValue ?? "");
	const submit = () => onSubmit(query);
	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			submit();
			e.currentTarget.blur();
		}
	};
	const smallScreen = useMediaQuery(`(max-width: ${breakpoints["md"]})`);
	return (
		<Flex gap="sm" maw={maxWidth} w="100%">
			<TextInput
				type="search"
				placeholder="Search..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={onKeyDown}
				size="sm"
				leftSection={
					smallScreen ? undefined : (
						<IconSearch size="20" className={css.left} />
					)
				}
				rightSection={
					query && (
						<Button
							variant="transparent"
							size="compact-xs"
							onClick={() => {
								setQuery("");
								onClear?.();
							}}
							title="Clear search"
							c="black"
						>
							<IconX size="20" />
						</Button>
					)
				}
				className={css.input}
			/>
			{smallScreen ? (
				<ActionIcon size="input-sm" onClick={submit}>
					<IconSearch size="20" className={css.left} />
				</ActionIcon>
			) : (
				<Button size="sm" onClick={submit}>
					Search
				</Button>
			)}
		</Flex>
	);
};
