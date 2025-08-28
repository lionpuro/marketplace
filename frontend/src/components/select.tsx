import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ children, className, ...props }: Props) => (
	<select
		className={[
			"bg-white disabled:bg-neutral-200/50 px-3 py-1.5 pr-3",
			"border-r-5 border-transparent outline outline-neutral-200",
			"focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-focus",
			className,
		]
			.join(" ")
			.trim()}
		{...props}
	>
		{children}
	</select>
);
