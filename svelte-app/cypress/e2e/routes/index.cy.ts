describe('E2E | Index', () => {
  it('should render index route', () => {
    cy.intercept('GET', '/api/getConfig');
    cy.visit('/');

    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="error-text"]').should('not.exist');

    cy.reload();

    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="error-text"]').should('not.exist');
  });
});
