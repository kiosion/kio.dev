import { returnPosts } from '../../fixtures/index';
import type { DocumentsSetupParams } from '../../types';

describe('E2E | Index', () => {
  const setupContext = ({ delay = 800, num }: DocumentsSetupParams) => {
    return cy.intercept('GET', '/api/getPosts*', (req) => {
      req.reply(returnPosts({ req, delay, num }));
    });
  };

  it('should render index route', () => {
    setupContext({});

    cy.visit('/');

    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');

    cy.reload();

    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
  });

  it('should display loading indicator until ready', () => {
    setupContext({ delay: 2000 }).as('getPosts');

    cy.visit('/');

    cy.get('[data-test-id="loader-full"]', { timeout: 6000 }).should(
      'be.visible'
    );

    cy.wait('@getPosts');

    cy.get('[data-test-id="loader-full"]', { timeout: 6000 }).should(
      'not.exist'
    );
  });

  it('should render index route with no posts', () => {
    setupContext({ num: 0 }).as('getPosts');

    cy.visit('/');
    cy.wait('@getPosts');

    cy.get('[data-test-id="navBar"]').should('be.visible');
    cy.get('[data-test-id="list-item"]').should('have.length', 0);
  });

  it('should render index route with posts', () => {
    setupContext({ num: 10 }).as('getPosts');

    cy.visit('/');
    cy.wait('@getPosts');

    cy.get('[data-test-id="navBar"]').should('be.visible');
    cy.get('[data-test-id="list-item"]').should('have.length', 10);
  });
});
