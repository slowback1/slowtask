import DSL from './dsl';

export default class UserDsl extends DSL {
	visit(): void {
		cy.visit('/');
	}

	verifyThatUserIsLoggedIn() {
		let refreshButton = cy.get("[data-testid='header__refresh-button']");
		refreshButton.should('be.visible');
	}

	clickRefreshButton() {
		let refreshButton = cy.get("[data-testid='header__refresh-button']");

		refreshButton.click();
	}

	registerUser() {
		let timestamp = new Date().getTime();
		let username = `username-${timestamp}`;
		let password = `Password!1`;

		let usernameField = cy.get("[data-testid='header__register-username']");
		let passwordField = cy.get("[data-testid='header__register-password']");

		usernameField.type(username);
		passwordField.type(password);

		let submitButton = cy.get("[data-testid='header__register-submit']");
		submitButton.click();
	}
}
