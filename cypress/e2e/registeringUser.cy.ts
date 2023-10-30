import UserDsl from '../pageObjects/userDsl';

describe('Registering Users', () => {
	let pageObject = new UserDsl();

	beforeEach(() => {
		pageObject.visit();
	});

	it('can register a user', () => {
		pageObject.registerUser();
		pageObject.verifyThatUserIsLoggedIn();
	});

	it('a registered user will persist between page reloads', () => {
		pageObject.registerUser();
		pageObject.verifyThatUserIsLoggedIn();

		pageObject.reloadPage();

		pageObject.verifyThatUserIsLoggedIn();
	});
});
