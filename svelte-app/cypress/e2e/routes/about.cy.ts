import { aboutRes } from '../../fixtures/about';
import type { AboutSetupParams } from '../../types';

describe('E2E | About', () => {
  const setupContext = ({ delay = 800, content = true }: AboutSetupParams) => {
    return cy.intercept('GET', '/api/get/about', (req) => {
      req.reply({
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: {
          meta: {
            length: content ? 1 : 0,
            filter: 'about'
          },
          data: content ? aboutRes() : undefined
        },
        delay
      });
    });
  };

  it('should render about route with no data', () => {
    setupContext({ content: false }).as('getAbout');

    cy.visit('/about');
    cy.wait('@getAbout');

    cy.get('[data-test-route="about"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="error-text"]').should('exist');

    cy.reload();

    cy.get('[data-test-route="about"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="error-text"]').should('exist');
  });

  it('should render about route and content', () => {
    setupContext({}).as('getAbout');

    cy.visit('/about');
    cy.wait('@getAbout');

    cy.get('[data-test-route="about"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-route="about"]').contains(
      'This is a demo structure for the about page'
    );
  });
});
