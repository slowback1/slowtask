import OneOffTaskDsl from '../pageObjects/oneOffTaskDsl';
import PlayerExperienceDsl from '../pageObjects/playerExperienceDsl';

describe('Player Experience', () => {
	let pageObject: PlayerExperienceDsl;

	beforeEach(() => {
		pageObject = new PlayerExperienceDsl();
		pageObject.visit();
	});

	it('starts off at zero experience points for a new player', () => {
		pageObject.validatePlayerExperienceIsEqualTo(0);
	});

	it('gains one experience for completing a task', () => {
		let taskName = 'I  give experience!';

		pageObject.addTask(taskName);

		pageObject.toggleTaskComplete(taskName);
		pageObject.validatePlayerExperienceIsEqualTo(1);
	});
});
