import DSL from './dsl';

export default class OneOffTaskDsl extends DSL {
	visit() {
		cy.visit('/task');
	}

	addTask(taskName: string) {
		cy.get("[data-testid='add-task-button']").click();

		cy.get("[data-testid='task-item__toggle']").last().click();
		cy.get("[data-testid='task-item__input']").clear().type(taskName);
		cy.get("[data-testid='task-item__save']").click();
	}

	editTaskName(oldName: string, newName: string) {
		this.activateTaskByName(oldName);
		cy.get("[data-testid='task-item__input']").clear().type(newName);
		cy.get("[data-testid='task-item__save']").click();
	}

	private activateTaskByName(name: string) {
		cy.get("[data-testid='task-item__toggle']").contains(name).click();
	}

	deleteTask(name: string) {
		this.activateTaskByName(name);
		cy.get("[data-testid='task-item__delete']").click();
	}

	validateTaskExists(taskName: string) {
		cy.get("[data-testid='task-item']").contains(taskName).should('exist');
	}

	validateTaskDoesNotExist(taskName: string) {
		cy.get("[data-testid='task-item']").contains(taskName).should('not.exist');
	}

	static validateIsOnTaskPage() {
		cy.url().should('contain', '/task');
	}
}
