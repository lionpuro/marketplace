export function localDate(d: string) {
	return new Date(d).toLocaleString(window.navigator.language, {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatPrice(cents: number) {
	const price = cents / 100;
	return price.toLocaleString("de-DE", {
		style: "currency",
		currency: "EUR",
	});
}

export function titleCase(s: string) {
	if (s.length < 2) {
		return "";
	}
	return s[0].toUpperCase() + s.slice(1);
}
