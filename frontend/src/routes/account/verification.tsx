import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../../auth/use-auth";

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
		<div className="flex flex-col max-w-screen-sm mx-auto w-full">
			<h1 className="text-xl font-semibold mb-8">Verify Your Email</h1>
			{currentUser && !currentUser.emailVerified && (
				<div className="flex flex-col gap-4">
					<p className="text-neutral-800">
						{(timerStarted || attempts > 0) &&
							`Verification email sent to ${currentUser.email}`}
					</p>
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
						{attempts > 0 ? "Resend email" : "Verify email"}
					</button>
				</div>
			)}
			{currentUser && currentUser.emailVerified && (
				<p>Email successfully verified!</p>
			)}
		</div>
	);
}
