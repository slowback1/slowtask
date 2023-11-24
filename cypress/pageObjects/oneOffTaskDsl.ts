import DSL from './dsl';

export default class OneOffTaskDsl extends DSL {
	visit() {
		cy.visit('/task');
		cy.wait(1500);
	}

	addTask(taskName: string) {
		cy.get("[data-testid='add-task-button']").click();

		cy.get("[data-testid='task-item__input']").clear().type(taskName);
		cy.get("[data-testid='task-item__save']").click();
	}

	editTaskName(oldName: string, newName: string) {
		cy.get("[data-testid='task-item__input']").clear().type(newName);
		cy.get("[data-testid='task-item__save']").click();
	}

	deleteTask(name: string) {
		cy.get("[data-testid='task-item__delete']").click();
	}

	validateTaskExists(taskName: string) {
		this.findTaskByName(taskName).should('exist');
	}

	validateTaskDoesNotExist(taskName: string) {
		cy.contains(taskName).should('not.exist');
	}

	private findTaskByName(taskName: string) {
		return cy
			.get('[data-testid="task-item__input"]')
			.filter((_, element: HTMLInputElement) => element.value == taskName)
			.eq(0);
	}

	private selectTaskCheckbox(taskName: string) {
		return this.findTaskByName(taskName)
			.parent("[data-testid='task-item']")
			.get("[data-testid='task-item__complete']");
	}

	toggleTaskComplete(taskName: string) {
		this.selectTaskCheckbox(taskName).click();
	}

	verifyIfTaskIsComplete(taskName: string, shouldBeComplete: boolean) {
		this.selectTaskCheckbox(taskName).should(shouldBeComplete ? 'be.checked' : 'not.be.checked');
	}

	static validateIsOnTaskPage() {
		cy.url().should('contain', '/task');
	}
}
