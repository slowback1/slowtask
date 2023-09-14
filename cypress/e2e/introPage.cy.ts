import IntroPageDsl from '../pageObjects/introPageDsl';
import OneOffTaskDsl from '../pageObjects/oneOffTaskDsl';

describe('Intro Page', () => {
	let pageObject: IntroPageDsl;

	beforeEach(() => {
		pageObject = new IntroPageDsl();
		pageObject.visit();
	});

	it('can load the page', () => {
		pageObject.validateIsOnIntroPage();
	});

	it('navigates to the tasks page when clicking the new user button', () => {
		pageObject.clickNewUserButton();
		OneOffTaskDsl.validateIsOnTaskPage();
	});
});
