import css from "./layout.module.css";
import { Link } from "#/components/link";
import { type ReactNode } from "react";
import { useAuth } from "#/auth/use-auth";
import {
	IconChevronDown,
	IconNote,
	IconPlus,
	IconSignOut,
	IconUser,
} from "#/components/icons";
import {
	AppShell,
	Container,
	Button,
	Menu,
	Text,
	Flex,
	ScrollArea,
	Box,
} from "@mantine/core";
import ReactRemoveScroll from "react-remove-scroll/dist/es5/Combination";
import { useMobile } from "#/hooks/use-mobile";
import { SearchBar } from "#/components/searchbar";
import { useNavigate } from "@tanstack/react-router";

export type LayoutProps = {
	sidebar?: ReactNode;
	sidebarOpen?: boolean;
	children?: ReactNode;
	query?: string;
};

export const Layout = ({
	sidebar,
	sidebarOpen,
	children,
	query,
}: LayoutProps) => {
	const { isAuthenticated, signOut } = useAuth();
	const isMobile = useMobile();
	const navigate = useNavigate();
	const onSearch = (query?: string) => {
		navigate({
			to: "/listings",
			search: (prev) => ({ ...prev, q: query ? query : undefined }),
		});
	};
	return (
		<>
			<AppShell
				header={{ height: { base: 120, sm: 60 } }}
				navbar={
					sidebar
						? {
								width: 240,
								breakpoint: "sm",
								collapsed: { mobile: !sidebarOpen },
							}
						: undefined
				}
				transitionDuration={0}
				className={css.shell}
			>
				<AppShell.Header className={css.header}>
					<Container size="xl" px="md" className={css["header-main"]}>
						<Link to="/" c="black" className={css.logo}>
							MARKETPLACE
						</Link>
						<div className={css.searchbar}>
							<SearchBar
								onSubmit={onSearch}
								defaultValue={query}
								maxWidth={isMobile ? undefined : 600}
							/>
						</div>
						<Flex align="center" gap="lg" className={css["header-right"]}>
							{!isAuthenticated ? (
								<>
									<Link to="/signin">Sign in</Link>
									<Link to="/signup">Sign up</Link>
								</>
							) : (
								<>
									<Link to="/listings/new">
										<IconPlus />
										New listing
									</Link>
									<Menu
										shadow="sm"
										width={200}
										position="top-end"
										transitionProps={{ duration: 50, transition: "fade" }}
									>
										<Menu.Target>
											<Button
												variant="transparent"
												size="compact-md"
												px={0}
												c="base.6"
											>
												Account
												<IconChevronDown size="18" />
											</Button>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												leftSection={<IconUser size="18" />}
												c="base.6"
											>
												<Link to="/account" c="base.6">
													Account
												</Link>
											</Menu.Item>
											<Menu.Item
												leftSection={<IconNote size="18" />}
												c="base.6"
											>
												<Link to="/my-listings" c="base.6">
													My listings
												</Link>
											</Menu.Item>
											<Menu.Item
												onClick={signOut}
												c="red"
												leftSection={<IconSignOut size="18" />}
											>
												<Text> Sign out </Text>
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</>
							)}
						</Flex>
					</Container>
				</AppShell.Header>
				<Container size="xl" p={"md"}>
					<div className={css.inner}>
						{sidebar && (
							<AppShell.Navbar
								pos={!isMobile ? "sticky" : undefined}
								pr="md"
								pl={isMobile ? "md" : 0}
							>
								<ReactRemoveScroll enabled={isMobile && sidebarOpen}>
									<AppShell.Section
										grow
										component={ScrollArea.withProps({
											type: "never",
											h: "100vh",
										})}
										py={isMobile ? 0 : "xl"}
									>
										<Box>{sidebar}</Box>
									</AppShell.Section>
								</ReactRemoveScroll>
							</AppShell.Navbar>
						)}
						<AppShell.Main pb={120} className={css.main}>
							<div className={css.content}>{children}</div>
						</AppShell.Main>
					</div>
				</Container>
			</AppShell>
		</>
	);
};
