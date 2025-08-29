import { Spinner } from "./spinner";

export const Loading = () => (
	<Spinner
		size={36}
		className="fixed left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] text-neutral-400"
	/>
);
