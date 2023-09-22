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

	it('can edit a task', () => {
		const firstName = 'write more tests';
		const secondName = 'make those tests pass';

		pageObject.addTask(firstName);
		pageObject.editTaskName(firstName, secondName);
		pageObject.validateTaskExists(secondName);
	});

	it('can delete a task', () => {
		const name = 'delete this test';

		pageObject.addTask(name);
		pageObject.validateTaskExists(name);
		pageObject.deleteTask(name);
		pageObject.validateTaskDoesNotExist(name);
	});
});
