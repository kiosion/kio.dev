import { setFeature } from '../helpers/features';

describe('E2E | features | tooltips', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        setFeature('tooltips', true);
      }
    });
    cy.get('body.is-loaded', { timeout: 4000 }).should('exist');
  });

  it('should show tooltips for buttons', () => {
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').trigger('mouseenter');
    cy.wait(1000);
    cy.get('[data-test-id="tooltip-container"]').should('exist');
    cy.get('[data-tippy-root]').should('be.visible');
    cy.get('[data-tippy-root]').should('contain', 'Use light mode');
  });

  it('should show tooltips on focus', () => {
    cy.get('[data-test-id="theme-toggle"]').filter(':visible').focus();
    cy.wait(1000);
    cy.get('[data-tippy-root]').should('be.visible');
    cy.get('[data-tippy-root]').should('contain', 'Use light mode');
  });
});
