const cypress = require('cypress');

async function runCypressTests() {
  try {
    await cypress.run({
      headless: true,
      video: false,
      spec: 'cypress/e2e/counter_spec.cy.js'
    });
  } catch (error) {
    console.error('Cypress tests failed:', error);
  }
}

runCypressTests();