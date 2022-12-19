import { setFeature } from '../helpers/features';

describe('E2E | features | tooltips', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        setFeature('tooltips', true);
      }
    });
    cy.get('[data-test-route="index"]', { timeout: 4000 }).should('exist');
  });

  it('should show tooltips for buttons', () => {
    cy.get('[data-test-id="theme-toggle"]')
      .filter(':visible')
      .trigger('mouseenter');
    cy.wait(1000);
    cy.get('[data-test-id="tooltip-container"]').should('exist');
    cy.get('[data-tippy-root]').should('be.visible');
    cy.get('[data-tippy-root]').should('contain', 'Toggle theme');
  });

  it('should follow the cursor', () => {
    cy.get('[data-test-id="theme-toggle"]')
      .filter(':visible')
      .trigger('mouseenter');
    cy.wait(1000);
    cy.get('[data-tippy-root]').should('be.visible');
    cy.get('[data-tippy-root]').should('contain', 'Toggle theme');
    // check that the tooltip follows the cursor, first store the initial position
    cy.get('[data-tippy-root]').then(($el) => {
      const initialPosition = $el[0].getBoundingClientRect();
      cy.get('[data-test-id="theme-toggle"]')
        .filter(':visible')
        // move mouse by 2px so it's still over the button
        .trigger('mousemove', { clientX: 2, clientY: 2 });
      cy.wait(100);
      cy.get('[data-tippy-root]').then(($el) => {
        const newPosition = $el[0].getBoundingClientRect();
        expect(newPosition.left).to.be.greaterThan(initialPosition.left);
        expect(newPosition.top).to.be.greaterThan(initialPosition.top);
      });
    });
  });

  it('should respond for focus & mouse', () => {
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').focus();
    cy.wait(1000);
    cy.get('[data-tippy-root]').should('be.visible');
    cy.get('[data-tippy-root]').should('contain', 'Toggle theme');
    cy.get('[data-test-id="theme-toggle"]')
      .filter(':visible')
      .trigger('mouseenter');
    cy.wait(1000);
    cy.get('[data-tippy-root]').should('be.visible');
    cy.get('[data-tippy-root]').should('contain', 'Toggle theme');
  });
});
