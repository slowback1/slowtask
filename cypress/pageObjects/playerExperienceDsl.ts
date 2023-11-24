import OneOffTaskDsl from './oneOffTaskDsl';

export default class PlayerExperienceDsl extends OneOffTaskDsl {
	validatePlayerExperienceIsEqualTo(experience: number) {
		cy.get("[data-testid='experience-bar']").should('have.value', experience);
	}
}
