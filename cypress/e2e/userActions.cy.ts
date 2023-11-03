import UserDsl from '../pageObjects/userDsl';
import OneOffTaskDsl from '../pageObjects/oneOffTaskDsl';

describe('User Actions', () => {
	let pageObject = new UserDsl();

	beforeEach(() => {
		pageObject.visit();
	});

	describe('Registering Users', () => {
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

	describe('Logging user out', () => {
		beforeEach(() => {
			pageObject.registerUser();
		});

		it('can log out of a user', () => {
			pageObject.clickLogOutButton();

			pageObject.verifyThatUserIsLoggedOut();
		});

		it('logging out clears out the task data', () => {
			let taskPage = new OneOffTaskDsl();

			taskPage.visit();

			taskPage.addTask('test task');

			pageObject.clickLogOutButton();

			taskPage.visit();

			taskPage.validateTaskDoesNotExist('test task');
		});
	});
});
