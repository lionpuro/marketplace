import "./index.css";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "#/auth/provider";
import { routeTree } from "#/routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
const Toast = lazy(() => import("#/components/toast"));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			retry: 2,
			staleTime: 60 * 1000,
		},
	},
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MantineProvider theme={theme}>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
					<Suspense>
						<Toast />
					</Suspense>
				</QueryClientProvider>
			</AuthProvider>
		</MantineProvider>
	</StrictMode>,
);
