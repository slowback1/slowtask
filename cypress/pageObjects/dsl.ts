export default abstract class DSL {
	abstract visit(): void;

	reloadPage() {
		this.visit();
	}

	verifyIsOnPage(page: '/' | '/task') {
		cy.url().should('include', page);
	}
}
