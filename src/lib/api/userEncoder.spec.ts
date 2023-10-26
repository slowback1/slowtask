import UserEncoder from '$lib/api/userEncoder';

describe('UserEncoder', () => {
	it.each([
		['username', 'password', 'dXNlcm5hbWVfcGFzc3dvcmQ='],
		[
			'super-duper-strong-username',
			'super-ultra-strong-password1',
			'c3VwZXItZHVwZXItc3Ryb25nLXVzZXJuYW1lX3N1cGVyLXVsdHJhLXN0cm9uZy1wYXNzd29yZDE='
		]
	])(
		'generates the correct key when given %s and %s for the username and password',
		(username, password, expectedValue) => {
			let encoder = new UserEncoder(username, password);

			let result = encoder.encode();

			expect(result).toEqual(expectedValue);
		}
	);
});
