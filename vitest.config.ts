import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Use global test functions like `describe`, `it`, etc.
    environment: 'node', // Set the test environment to Node.js
    coverage: {
      reporter: ['text', 'json', 'html'], // Coverage reporters
    },
  },
});