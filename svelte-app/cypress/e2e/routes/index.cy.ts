describe('E2E | Index', () => {
  it('should render index route', () => {
    cy.intercept('GET', '/api/get/config');
    cy.visit('/');

    cy.get('div.main', { timeout: 4000 }).should('contain', 'kio.dev | Index');
    cy.get('[data-test-id="error-text"]').should('not.exist');

    cy.reload();

    cy.get('div.main', { timeout: 4000 }).should('contain', 'kio.dev | Index');
    cy.get('[data-test-id="error-text"]').should('not.exist');
  });
});
