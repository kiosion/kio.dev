import { toRGB } from '../helpers/colors';

describe('E2E | features | theme', () => {
  it('should toggle between light/dark mode', () => {
    cy.visit('/');
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('body').should('have.css', 'background-color', toRGB('#0f172a'));
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('body').should('have.css', 'background-color', toRGB('#e2e8f0'));
  });

  it('should toggle between light/dark mode', () => {
    cy.visit('/work');
    cy.get('[data-test-route="work"]', { timeout: 4000 }).should('exist');
    cy.get('body').should('have.css', 'background-color', toRGB('#0f172a'));
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('body').should('have.css', 'background-color', toRGB('#e2e8f0'));
  });

  it('should toggle between light/dark mode', () => {
    cy.visit('/about');
    cy.get('[data-test-route="about"]', { timeout: 4000 }).should('exist');
    cy.get('body').should('have.css', 'background-color', toRGB('#0f172a'));
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('body').should('have.css', 'background-color', toRGB('#e2e8f0'));
  });

  it('should store preference in localStorage', () => {
    cy.visit('/');
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('body').should('have.css', 'background-color', toRGB('#0f172a'));
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('body').should('have.css', 'background-color', toRGB('#e2e8f0'));

    cy.reload();

    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('body').should('have.css', 'background-color', toRGB('#e2e8f0'));
  });
});
