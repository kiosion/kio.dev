describe('E2E | features | sounds', () => {
  it('should default to enabled', () => {
    cy.visit('/');
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('feature-sounds')).to.eq('on');
    });
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'on');
  });
  it('should toggle between enabled/disabled', () => {
    cy.visit('/');
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'on');
    cy.get('[data-test-id="sfx-toggle"]').filter(':visible').click();
    cy.window().then((win) => {
      expect(win.localStorage.getItem('feature-sounds')).to.eq('off');
    });
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'off');
  });
  it('should persist between page loads', () => {
    cy.visit('/');
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'on');
    cy.get('[data-test-id="sfx-toggle"]').filter(':visible').click();
    cy.window().then((win) => {
      expect(win.localStorage.getItem('feature-sounds')).to.eq('off');
    });
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'off');
    cy.reload();
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="sfx-toggle"]')
      .filter(':visible')
      .should('have.attr', 'data-test-state', 'off');
  });
});
