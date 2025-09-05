import { Layout, type LayoutProps } from "./layout";
import { Spinner } from "./spinner";

export const Loading = () => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			flexGrow: 1,
		}}
	>
		<Spinner size={36} />
	</div>
);

export const LoadingPage = (layoutProps?: LayoutProps) => (
	<Layout {...layoutProps}>
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexGrow: 1,
			}}
		>
			<Spinner size={36} />
		</div>
	</Layout>
);
