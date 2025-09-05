import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "#/auth/use-auth";
import { Protected } from "#/components/protected";
import { toast } from "react-toastify";
import { Layout } from "#/components/layout";
import { Box, Button, Stack, Text, Title } from "@mantine/core";

export const Route = createFileRoute("/account/verification")({
	component: Verification,
});

function Verification() {
	const { isAuthenticated, currentUser } = useAuth();
	const [timerStarted, setTimerStarted] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);
	const [attempts, setAttempts] = useState(0);

	const startTimer = () => {
		setTimeLeft(30 * 1000);
		setTimerStarted(true);
	};

	const sendVerification = async () => {
		if (!currentUser) {
			return;
		}
		try {
			if (!currentUser.emailVerified) {
				setAttempts(attempts + 1);
				startTimer();
				await sendEmailVerification(currentUser, { url: window.location.href });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to send verification link");
			setTimeLeft(0);
			setTimerStarted(false);
		}
	};

	useEffect(() => {
		if (timerStarted) {
			const interval = setInterval(() => {
				const remaining = timeLeft - 1000;
				if (remaining <= 0) {
					clearInterval(interval);
					setTimerStarted(false);
				}
				setTimeLeft(remaining);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timerStarted, timeLeft]);

	if (!isAuthenticated) {
		return <Navigate to="/signin" />;
	}
	return (
		<Layout>
			<Title order={1}>Verify your email</Title>
			<Protected allowUnverified={true}>
				{currentUser && !currentUser.emailVerified && (
					<Stack gap="sm">
						<p>To complete your sign up, please verify your email</p>
						{(timerStarted || attempts > 0) && (
							<Text>
								{"Verification link sent to "}
								<Box fw={500} component="span">
									{currentUser.email}
								</Box>
							</Text>
						)}
						<Text c="gray.6">
							{timerStarted && timeLeft > 0
								? `You can retry in ${timeLeft / 1000} ${timeLeft / 1000 === 1 ? "second" : "seconds"}`
								: null}
						</Text>
						<Button
							w="fit-content"
							onClick={sendVerification}
							disabled={timeLeft > 0}
						>
							{attempts > 0 ? "Resend" : "Verify"}
						</Button>
					</Stack>
				)}
				{currentUser && currentUser.emailVerified && (
					<p>Email successfully verified!</p>
				)}
			</Protected>
		</Layout>
	);
}
