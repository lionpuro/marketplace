import { breakpoints } from "#/theme";
import { useMediaQuery } from "@mantine/hooks";

export function useMobile() {
	const bp = breakpoints.sm;
	return !useMediaQuery(`(min-width: ${bp})`, undefined, {
		getInitialValueInEffect: false,
	});
}
