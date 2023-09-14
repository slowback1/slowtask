import IntroPageDsl from '../pageObjects/introPageDsl';
import OneOffTaskDsl from '../pageObjects/oneOffTaskDsl';

describe('One Off Tasks', () => {
	let pageObject: OneOffTaskDsl;

	beforeEach(() => {
		pageObject = new OneOffTaskDsl();
		pageObject.visit();
	});

	it('can add a task', () => {
		const taskName = 'write more tests';

		pageObject.addTask(taskName);
		pageObject.validateTaskExists(taskName);
	});
});
