/* eslint-disable @typescript-eslint/no-empty-function */
import { toRGB } from '../helpers/colors';

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
    cy.get('body').should('have.css', 'background-color', toRGB('#111827'));
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('body').should('have.css', 'background-color', toRGB('#e5e7eb'));
  });

  it('should store preference in localStorage', () => {
    cy.get('body').should('have.css', 'background-color', toRGB('#111827'));
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').click();
    cy.get('body').should('have.css', 'background-color', toRGB('#e5e7eb'));

    cy.reload();

    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
    cy.get('body').should('have.css', 'background-color', toRGB('#e5e7eb'));
  });
});
