import Loader from '@/components/loading/full.svelte';

describe('Component | Loader | Full', function () {
  it('renders loader', () => {
    mount(Loader);
    cy.get('[data-test-id="loader-full"]').should('exist');
  });
});
