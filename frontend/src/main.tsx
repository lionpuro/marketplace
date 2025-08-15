import "./index.css";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "#/auth/provider";
import { routeTree } from "#/routeTree.gen";
const Toast = lazy(() => import("#/components/toast"));

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
			<Suspense>
				<Toast />
			</Suspense>
		</AuthProvider>
	</StrictMode>,
);
