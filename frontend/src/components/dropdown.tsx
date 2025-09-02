import { type ReactNode, useEffect, useRef } from "react";

type Props = {
	label: ReactNode;
	children?: ReactNode;
	className?: string;
	position?: "top-left" | "top-right";
};
export const Dropdown = ({ label, children, className, position }: Props) => {
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
		<details
			ref={detailsRef}
			className={["relative", className].join(" ").trim()}
		>
			<summary
				ref={summaryRef}
				className="cursor-pointer list-none select-none flex items-center gap-1 py-1.5 text-base-600 hover:text-base-900"
			>
				{label}
			</summary>
			<div
				className={`absolute ${position === "top-right" ? "right-0" : "left-0"} bg-white border border-base-100 flex flex-col`}
			>
				{children}
			</div>
		</details>
	);
};
