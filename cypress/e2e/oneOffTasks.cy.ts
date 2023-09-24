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

	it('can toggle a task complete', () => {
		const name = 'complete this task';

		pageObject.addTask(name);
		pageObject.validateTaskExists(name);
		pageObject.toggleTaskComplete(name);
		pageObject.verifyIfTaskIsComplete(name, true);
	});

	it('toggling the task twice sets the task to not complete', () => {
		const name = 'uncomplete this task';

		pageObject.addTask(name);
		pageObject.validateTaskExists(name);
		pageObject.toggleTaskComplete(name);
		pageObject.verifyIfTaskIsComplete(name, true);
		pageObject.toggleTaskComplete(name);
		pageObject.verifyIfTaskIsComplete(name, false);
	});

	it('toggle the task complete persists after a page reload', () => {
		const name = 'this should persist';

		pageObject.addTask(name);
		pageObject.validateTaskExists(name);
		pageObject.toggleTaskComplete(name);
		pageObject.verifyIfTaskIsComplete(name, true);

		pageObject.reloadPage();

		pageObject.verifyIfTaskIsComplete(name, true);
	});
});
