describe('E2E | Index', () => {
  const returnPosts = ({ req, delay = 1200, num = null }) => {
    num = num || req.query.limit;
    num = num || 10;
    const posts = [];
    for (let i = 0; i < num; i++) {
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
          length: num,
          filter: req.query
        },
        data: posts
      },
      delay
    };
  };

  it('should display loading indicator until ready', () => {
    cy.intercept('GET', '/api/getPosts*', (req) => {
      req.reply(returnPosts({ req, delay: 3600 }));
    }).as('getPosts');

    cy.visit('/');
    cy.get('[data-test-id="loader"]').should('be.visible');
    cy.wait('@getPosts');
    cy.get('[data-test-id="loader"]').should('not.exist');
  });

  it('should render with no posts', () => {
    cy.intercept('GET', '/api/getPosts*', (req) => {
      req.reply(returnPosts({ req }));
    }).as('getPosts');

    cy.visit('/');
    cy.wait('@getPosts');

    cy.get('[data-test-id="navBar"]').should('be.visible');
  });

  it('should render with posts', () => {
    cy.intercept('GET', '/api/getPosts*', (req) => {
      req.reply(returnPosts({ req, num: 10 }));
    }).as('getPosts');

    cy.visit('/');
    cy.wait('@getPosts');

    cy.get('[data-test-id="navBar"]').should('be.visible');
  });
});
