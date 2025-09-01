import { useState, type KeyboardEvent } from "react";
import { IconSearch, IconX } from "#/components/icons";

type Props = {
	defaultValue?: string;
	className?: string;
	onSubmit: (query?: string) => void;
	onClear?: () => void;
};

export const SearchBar = ({
	defaultValue,
	className,
	onSubmit,
	onClear,
}: Props) => {
	const [query, setQuery] = useState(defaultValue ?? "");
	const submit = () => onSubmit(query);
	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			submit();
			e.currentTarget.blur();
		}
	};
	return (
		<div className={["flex gap-4", className].filter((cn) => !!cn).join(" ")}>
			<div className="flex items-center grow bg-white border border-base-100 focus-within:outline-2 outline-focus -outline-offset-1">
				<IconSearch size="20" className="text-base-400 ml-2 shrink-0" />
				<input
					type="search"
					placeholder="Search..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={onKeyDown}
					className="w-full my-1.5 py-0.5 px-2 rounded-none mr-2 outline-none placeholder:text-base-400"
				/>
				{query && (
					<button
						onClick={() => {
							setQuery("");
							onClear?.();
						}}
						title="Clear search"
						className="p-2 text-base-600 hover:text-base-950"
					>
						<IconX size="20" />
					</button>
				)}
			</div>
			<button
				onClick={submit}
				className="py-1.5 px-4 text-white bg-primary-400"
			>
				Search
			</button>
		</div>
	);
};
