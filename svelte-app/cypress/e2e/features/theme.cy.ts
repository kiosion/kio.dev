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
  });

  it('should toggle between light/dark mode', () => {
    cy.visit('/', {
      // onBeforeLoad(win) {
      //   cy.stub(win, 'matchMedia')
      //     .withArgs('(prefers-color-scheme: dark)')
      //     .apply({ matches: true });
      // }
    });
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
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
