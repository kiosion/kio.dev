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
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
  });

  it('should toggle between light/dark mode', () => {
    cy.get('[data-test-theme="dark"]').should('exist');
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('[data-test-theme="light"]').should('exist');
  });

  it('should store preference in localStorage', () => {
    cy.get('[data-test-theme="dark"]').should('exist');
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('[data-test-theme="light"]').should('exist');

    cy.reload();

    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-theme="light"]').should('exist');
  });
});
