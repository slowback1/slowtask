import { addDays, addMonths } from '$lib/utils/dateUtils';

describe('Date Utilities', () => {
	it.each([[new Date(2022, 0, 1), 1, new Date(2022, 0, 2)]])(
		'with the given input has the correct output for adding days',
		(start, input, output) => {
			let result = addDays(start, input);

			expect(result).toEqual(output);
		}
	);

	it.each([[new Date(2022, 0, 1), 1, new Date(2022, 1, 1)]])(
		'with the given input has the correct output for adding months',
		(start, input, output) => {
			let result = addMonths(start, input);

			expect(result).toEqual(output);
		}
	);
});
