import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "#/auth/use-auth";
import { H1 } from "#/components/headings";
import { Protected } from "#/components/protected";
import { toast } from "react-toastify";

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
		<div className="flex flex-col grow max-w-screen-sm mx-auto w-full">
			<H1>Verify your email</H1>
			<Protected allowUnverified={true}>
				{currentUser && !currentUser.emailVerified && (
					<div className="flex flex-col gap-4">
						<p>To complete your sign up, please verify your email</p>
						{(timerStarted || attempts > 0) && (
							<p className="text-neutral-800">
								{"Verification link sent to "}
								<span className="font-medium">{currentUser.email}</span>
							</p>
						)}
						<p className="text-neutral-600">
							{timerStarted && timeLeft > 0
								? `You can retry in ${timeLeft / 1000} ${timeLeft / 1000 === 1 ? "second" : "seconds"}`
								: null}
						</p>
						<button
							onClick={sendVerification}
							className="bg-primary-400 hover:bg-primary-500 text-neutral-50 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed px-4 py-2 w-fit"
							disabled={timeLeft > 0}
						>
							{attempts > 0 ? "Resend" : "Verify"}
						</button>
					</div>
				)}
				{currentUser && currentUser.emailVerified && (
					<p>Email successfully verified!</p>
				)}
			</Protected>
		</div>
	);
}
