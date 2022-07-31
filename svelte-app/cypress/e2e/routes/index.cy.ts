import type { CyHttpMessages } from 'cypress/types/net-stubbing';
interface SetupParams {
  delay?: number;
  num?: number;
}

interface ReturnPostsParams {
  req: CyHttpMessages.IncomingHttpRequest;
  delay: number;
  num?: string | number;
}

describe('E2E | Index', () => {
  const returnPosts = ({ req, delay, num }: ReturnPostsParams) => {
    let numPosts = num || +req.query.limit;
    numPosts = numPosts || 10;
    const posts = [];
    for (let i = 0; i < numPosts; i++) {
      posts.push({
        _id: `${i}`,
        _type: 'post',
        date: `${new Date(
          Math.floor(
            Math.random() *
              (new Date('2021-01-01').getTime() -
                new Date('2020-01-01').getTime())
          ) + new Date('2020-01-01').getTime()
        ).toISOString()}`,
        desc: "Something very interesting I'm sure",
        slug: {
          current: `post-${i}`
        },
        title: `Post ${i}`
      });
    }
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      body: {
        meta: {
          length: numPosts,
          filter: req.query
        },
        data: posts
      },
      delay
    };
  };

  const setupContext = ({ delay = 800, num }: SetupParams) => {
    return cy.intercept('GET', '/api/getPosts*', (req) => {
      req.reply(returnPosts({ req, delay, num }));
    });
  };

  it('should render index route', () => {
    setupContext({});

    cy.visit('/');

    cy.get('[data-test-route="index"]').should('exist');

    cy.reload();

    cy.get('[data-test-route="index"]').should('exist');
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
  });

  it('should render index route with posts', () => {
    setupContext({ num: 10 }).as('getPosts');

    cy.visit('/');
    cy.wait('@getPosts');

    cy.get('[data-test-id="navBar"]').should('be.visible');
  });
});
