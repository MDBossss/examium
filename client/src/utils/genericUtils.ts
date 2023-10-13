export function notEmpty<T>(arr: T[]): boolean {
	return arr.length > 0;
}

export function getRandomItemFromArray<T>(arr: T[]): T | null {
	if (Array.isArray(arr) && arr.length > 0) {
		const randomIndex = Math.floor(Math.random() * arr.length);
		return arr[randomIndex];
	} else {
		return null;
	}
}
