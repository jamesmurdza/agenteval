const cypress = require("cypress");
const fs = require("fs-extra");

async function runCypressTests() {
  try {
    const results = await cypress.run({
      headless: true,
      config: {
        video: false,
      },
      spec: "cypress/e2e/counter_spec.cy.js",
      reporter: "junit",
      quiet: true,
    });

    return results;
  } catch (error) {
    console.error("Cypress tests failed:", error);
    throw error;
  }
}

const sourceDir = "./evals/eval-001/app";
const targetDir = "./output/eval-001/app";

fs.remove(targetDir)
  .then(() => {
    console.log("Directory removed successfully!");
    fs.ensureDir(targetDir)
      .then(() => {
        return fs.copy(sourceDir, targetDir);
      })
      .then(() => {
        console.log("Directory copied successfully!");
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });

runCypressTests()
  .then((results) => {
    // Handle the test results here
    console.log("Cypress tests completed successfully:");
    console.log("Total tests:", results.totalTests);
    console.log("Total passed:", results.totalPassed);
    console.log("Total failed:", results.totalFailed);
    console.log("Duration:", results.totalDuration);
  })
  .catch((error) => {
    // Handle any errors that occurred during test execution
    console.error("Cypress tests failed:", error);
  });
