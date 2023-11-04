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

		it('registering the user drops the user off on the tasks page', () => {
			pageObject.registerUser();
			pageObject.verifyIsOnPage('/task');
		});
	});

	describe('Logging user out', () => {
		it('can log out of a user', () => {
			pageObject.registerUser();
			pageObject.clickLogOutButton();

			pageObject.verifyThatUserIsLoggedOut();
		});

		it('logging out clears out the task data', () => {
			pageObject.registerUser();
			let taskPage = new OneOffTaskDsl();

			taskPage.visit();

			taskPage.addTask('test task');

			pageObject.clickLogOutButton();

			taskPage.visit();

			taskPage.validateTaskDoesNotExist('test task');
		});
	});

	describe('Logging in', () => {
		it('can log in as an already registered user', () => {
			pageObject.registerUser();
			pageObject.verifyThatUserIsLoggedIn();
			pageObject.clickLogOutButton();
			pageObject.verifyThatUserIsLoggedOut();
			pageObject.logIn();
			pageObject.verifyThatUserIsLoggedIn();
		});

		it('logging the user in should drop the user off on the tasks page', () => {
			pageObject.registerUser();
			pageObject.verifyThatUserIsLoggedIn();
			pageObject.clickLogOutButton();
			pageObject.verifyThatUserIsLoggedOut();
			pageObject.logIn();
			pageObject.verifyIsOnPage('/task');
		});
	});
});
