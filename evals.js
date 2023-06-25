const cypress = require("cypress");
const fs = require("fs-extra");
const runAgent = require("./agents/codegen.js").run;

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

const promptFilePath = "./evals/eval-001/prompt.md";
const sourceDir = "./evals/eval-001/app";
const targetDir = "./output/eval-001/app";

async function runEvals() {
  try {
    await fs.remove(targetDir);
    console.log("Directory removed successfully!");
    await fs.ensureDir(targetDir);
    await fs.copy(sourceDir, targetDir);
    console.log("Directory copied successfully!");

    await runAgent(targetDir, fs.readFileSync(promptFilePath, "utf-8"));

    const results = await runCypressTests();
    console.log("Cypress tests completed successfully:");
    console.log("Total tests:", results.totalTests);
    console.log("Total passed:", results.totalPassed);
    console.log("Total failed:", results.totalFailed);
    console.log("Duration:", results.totalDuration);
  } catch (error) {
    console.error("Error:", error);
  }
}

runEvals();
