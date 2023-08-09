import { returnPost, returnPosts } from '../../fixtures/index';

import type { DocumentsSetupParams } from '../../types';

describe('E2E | Blog', () => {
  const setupContext = ({ delay = 800, num, many = true }: DocumentsSetupParams) => {
    return many
      ? cy.intercept('GET', '/api/get/post/many*', (req) => {
          req.reply(returnPosts({ req, delay, num }));
        })
      : cy.intercept('GET', '/api/get/post*', (req) => {
          req.reply(returnPost({ req, delay, empty: num === 0 }));
        });
  };

  it('should render blog route', () => {
    setupContext({});

    cy.visit('/blog');

    cy.get('div.main', { timeout: 4000 }).should('exist');
    cy.get('div.main').should('contain', 'kio.dev | Thoughts');
  });

  // TODO: This should be a separate test
  // it('should display loading indicator until ready', () => {
  //   setupContext({ delay: 2000 }).as('getPosts');

  //   cy.visit('/blog');

  //   cy.get('[data-test-id="loader-full"]', { timeout: 6000 }).should('be.visible');

  //   cy.wait('@getPosts');

  //   cy.get('[data-test-id="loader-full"]', { timeout: 6000 }).should('not.exist');
  // });

  // TODO: Re-write after proper stubbing of api.
});
