import css from "./spinner.module.css";

export const Spinner = ({
	size = 24,
	position,
	className,
}: {
	size?: number;
	position?: "fixed";
	className?: string;
}) => {
	const cn = [css.spinner, css.spin];
	if (className) {
		cn.push(className);
	}
	if (position) {
		cn.push(css[position]);
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn.join(" ")}
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	);
};
