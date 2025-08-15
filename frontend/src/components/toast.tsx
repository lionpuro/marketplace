import { Slide, ToastContainer, type ToastOptions } from "react-toastify";

const options: ToastOptions = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: true,
	closeOnClick: true,
	pauseOnHover: true,
	pauseOnFocusLoss: false,
	theme: "light",
	className: "",
	transition: Slide,
};

export const Toast = () => {
	return <ToastContainer {...options} />;
};

export default Toast;
