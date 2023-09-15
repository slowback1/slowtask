import DSL from './dsl';

export default class IntroPageDsl extends DSL {
	visit() {
		cy.visit('/');
	}

	validateIsOnIntroPage() {
		cy.url().should('contain', '/');
	}

	clickNewUserButton() {
		cy.get("[data-cy='intro-page__new-user-button']").click();
	}
}