import {
	useLayoutEffect,
	useRef,
	type MouseEvent,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	children?: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: Props) => {
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	useLayoutEffect(() => {
		if (!isOpen && dialogRef.current?.open) {
			dialogRef.current?.close();
			return;
		}
		if (isOpen && !dialogRef.current?.open) {
			dialogRef.current?.showModal();
			return;
		}
	}, [isOpen]);

	const onClick = (e: MouseEvent<HTMLDialogElement>) => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const dialogRect = dialog.getBoundingClientRect();
		const outside =
			e.clientX < dialogRect.left ||
			e.clientX > dialogRect.right ||
			e.clientY < dialogRect.top ||
			e.clientY > dialogRect.bottom;
		if (outside) {
			onClose();
		}
	};

	return createPortal(
		<dialog
			ref={dialogRef}
			onClick={onClick}
			onClose={onClose}
			className="m-auto backdrop:bg-[rgba(0,0,0,0.75)]"
		>
			{children}
		</dialog>,
		document.body,
	);
};
