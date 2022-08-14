import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'vite'
    },
    specPattern: 'cypress/integration/**/*spec.ts'
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*cy.ts',
    video: false,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      VITE_TESTING: 'cypress'
    }
  }
});
