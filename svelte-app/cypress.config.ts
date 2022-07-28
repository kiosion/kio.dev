import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    // setupNodeEvents() {},
    specPattern: 'cypress/integration/**/*spec.ts'
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    // setupNodeEvents() {},
    specPattern: 'cypress/e2e/**/*cy.ts',
    env: {
      VITE_TESTING: 'cypress'
    }
  }
});
