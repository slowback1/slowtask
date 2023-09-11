describe('example spec', () => {
	cy.visit('/');

	cy.get('h1').should('exist');
});
