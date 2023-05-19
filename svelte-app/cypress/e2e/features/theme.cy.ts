describe('E2E | features | theme', () => {
  beforeEach(() => {
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Emulation.setEmulatedMedia',
        params: {
          media: 'page',
          features: [
            {
              name: 'prefers-color-scheme',
              value: 'dark'
            }
          ]
        }
      })
    );
    cy.visit('/');
    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
  });

  it('should persist between loads', () => {
    cy.get('body').should('have.class', 'dark');
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('body').should('have.class', 'light');

    cy.reload();

    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
    cy.get('body').should('have.class', 'light');
  });
});
