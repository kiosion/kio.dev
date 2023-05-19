describe('E2E | features | sounds', () => {
  it('should default to enabled', () => {
    cy.visit('/');
    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'on');
  });
  it('should toggle', () => {
    cy.visit('/');
    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'on');
    cy.get('[data-test-id="sfx-toggle"]').filter(':visible').click();
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'off');
  });
  it('should persist between loads', () => {
    // clear local storage
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit('/');
    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'on');
    cy.get('[data-test-id="sfx-toggle"]').filter(':visible').click();
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'off');
    cy.visit('/');
    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'off');
  });
});
