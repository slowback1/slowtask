export function addDays(date: Date, days: number) {
	let result = new Date(date);

	result.setDate(result.getDate() + days);

	return result;
}

export function addMonths(date: Date, months: number) {
	let result = new Date(date);

	result.setMonth(result.getMonth() + months);

	return result;
}
