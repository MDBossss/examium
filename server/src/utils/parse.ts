export function parseBoolean(value: string) {
	if (value.toLowerCase() === "true") return true;
	else if (value.toLowerCase() === "false") return false;
}
