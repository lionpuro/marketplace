import type { ReactNode } from "react";

type Props = {
	children?: ReactNode;
};

export const H1 = ({ children }: Props) => (
	<h1 className="text-xl font-semibold mb-8">{children}</h1>
);
