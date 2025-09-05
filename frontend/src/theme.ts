import {
	createTheme,
	DEFAULT_THEME,
	Input,
	NativeSelect,
	TextInput,
} from "@mantine/core";

export const breakpoints = {
	xs: "36em", // 576px
	sm: "48em", // 768px
	md: "62em", // 992px
	lg: "75em", // 1200px
	xl: "88em", // 1408px
};

export const theme = createTheme({
	fontFamily: `"Geist Variable", ${DEFAULT_THEME.fontFamily}`,
	black: "var(--color-base-950)",
	colors: {
		juniper: [
			"#f5f8f7",
			"#dfe8e6",
			"#bed1cd",
			"#96b2ae",
			"#70918d",
			"#567673",
			"#435e5c",
			"#3c5250",
			"#303f3e",
			"#2b3636",
			"#151e1e",
		],
		base: [
			"var(--color-base-white)",
			"var(--color-base-50)",
			"var(--color-base-100)",
			"var(--color-base-200)",
			"var(--color-base-300)",
			"var(--color-base-400)",
			"var(--color-base-500)",
			"var(--color-base-600)",
			"var(--color-base-700)",
			"var(--color-base-800)",
			"var(--color-base-900)",
			"var(--color-base-950)",
		],
	},
	primaryShade: 5,
	primaryColor: "juniper",
	defaultRadius: 0,
	activeClassName: "",
	breakpoints: breakpoints,
	headings: {
		sizes: {
			h1: { fontSize: "2rem", fontWeight: "700" },
		},
	},
	components: {
		TextInput: TextInput.extend({
			defaultProps: { size: "md" },
			classNames: {
				input: "input-focus",
			},
		}),
		Input: Input.extend({
			defaultProps: { size: "md" },
		}),
		NativeSelect: NativeSelect.extend({
			defaultProps: { size: "md" },
		}),
		Anchor: {
			defaultProps: {
				underline: "never",
			},
			classNames: {
				root: "center-vertical",
			},
		},
	},
});
