const FormError = ({ message }: { message?: string }) =>
	!message ? null : <p className="text-red-600/80">{message}</p>;
export default FormError;
