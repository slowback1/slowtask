import DSL from './dsl';

export default class OneOffTaskDsl extends DSL {
	visit() {
		cy.visit('/task');
	}

	addTask(taskName: string) {
		cy.get("[data-cy='task__new-task-button]")
			.click()
			.get("input [type='text']")
			.type(taskName)
			.type('{enter}');
	}

	validateTaskExists(taskName: string) {
		cy.get("[data-cy='task__task-container").contains(taskName).should('exist');
	}

	static validateIsOnTaskPage() {
		cy.url().should('contain', '/task');
	}
}
