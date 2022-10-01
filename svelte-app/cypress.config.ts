import { defineConfig } from 'cypress';

const mode = process.env.CYPRESS_MODE;

export default defineConfig({
  e2e: {
    baseUrl: mode === 'dev' ? 'http://localhost:5173' : 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*cy.ts',
    video: false,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      VITE_TESTING: 'cypress'
    }
  },

  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'vite'
    }
  }
});
