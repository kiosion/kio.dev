import { aboutRes } from '../../fixtures/about';
import type { AboutSetupParams } from '../../types';

describe('E2E | About', () => {
  const setupContext = ({ delay = 800 }: AboutSetupParams) => {
    console.log('aboutRes', aboutRes);
    return cy.intercept('GET', '/api/getAbout*', (req) => {
      req.reply({
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: {
          meta: {
            length: 1,
            filter: 'about'
          },
          data: aboutRes()
        },
        delay
      });
    });
  };

  it('should render about route with no data', () => {
    cy.visit('/about');

    cy.get('[data-test-route="about"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-route="about"').contains('Error loading about');

    cy.reload();

    cy.get('[data-test-route="about"]', { timeout: 4000 }).should('exist');
    cy.get('[data-test-route="about"').contains('Error loading about');
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
