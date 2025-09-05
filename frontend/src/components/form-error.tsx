import { Text } from "@mantine/core";

const FormError = ({ message }: { message?: string }) =>
	!message ? null : <Text c="red">{message}</Text>;
export default FormError;
