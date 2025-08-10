import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
};

const Input = ({ className, ...props }: Props) => {
	return (
		<input
			className={`border border-neutral-200 px-3 py-1.5 ${className ? className : ""}`}
			{...props}
		/>
	);
};
export default Input;
