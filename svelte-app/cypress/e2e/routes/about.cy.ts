import { aboutRes } from '../../fixtures/about';
import type { AboutSetupParams } from '../../types';

describe('E2E | About', () => {
  const setupIntercept = ({
    url = '/api/get/about',
    delay = 800,
    content = true
  }: AboutSetupParams = {}) =>
    cy.intercept('GET', url, (req) =>
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
      })
    );

  it('should render about route with no data', () => {
    setupIntercept({ content: false }).as('getAboutSSR');
    setupIntercept({ url: '/api/get/about?lang=en', content: false }).as(
      'getAboutCSR'
    );

    cy.visit('/');
    cy.wait('@getAboutSSR');
    cy.wait('@getAboutCSR');

    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
    cy.get('[data-test-id="error-text"]').should('exist');
  });

  it('should render about route and content', () => {
    setupIntercept().as('getAboutSSR');
    setupIntercept({ url: '/api/get/about?lang=en' }).as('getAboutCSR');

    cy.visit('/');
    cy.wait('@getAboutSSR');
    cy.wait('@getAboutCSR');

    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
    cy.get('body.is-loaded').contains(
      'This is a demo structure for the about page'
    );
  });
});
