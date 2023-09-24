export default abstract class DSL {
	abstract visit(): void;

	reloadPage() {
		cy.reload();
	}
}
