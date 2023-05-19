import { returnPosts } from '../../fixtures/index';
import type { DocumentsSetupParams } from '../../types';

describe('E2E | Blog', () => {
  const setupContext = ({ delay = 800, num }: DocumentsSetupParams) => {
    return cy.intercept('GET', '/api/get/post/many*', (req) => {
      req.reply(returnPosts({ req, delay, num }));
    });
  };

  it('should render blog route', () => {
    setupContext({});

    cy.visit('/blog');

    cy.get('[data-test-route="blog"]', { timeout: 4000 }).should('exist');
  });

  // TODO: This should be a separate test
  it('should display loading indicator until ready', () => {
    setupContext({ delay: 2000 }).as('getPosts');

    cy.visit('/blog');

    cy.get('[data-test-id="loader-full"]', { timeout: 6000 }).should(
      'be.visible'
    );

    cy.wait('@getPosts');

    cy.get('[data-test-id="loader-full"]', { timeout: 6000 }).should(
      'not.exist'
    );
  });

  it('should render blog route with no posts', () => {
    setupContext({ num: 0 }).as('getPosts');

    cy.visit('/blog');
    cy.wait('@getPosts');

    cy.get('[data-test-id="navBar"]').should('be.visible');
    cy.get('[data-test-id="list-item"]').should('have.length', 0);
  });

  it('should render blog route with posts', () => {
    setupContext({ num: 10 }).as('getPosts');

    cy.visit('/blog');
    cy.wait('@getPosts');

    cy.get('[data-test-id="navBar"]').should('be.visible');
    cy.get('[data-test-id="list-item"]').should('have.length', 10);
  });
});
