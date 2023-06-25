const cypress = require("cypress");
const fs = require("fs-extra");
const runAgent = require("./agents/codegen.js").run;

async function runCypressTests(evalId) {
  try {
    const results = await cypress.run({
      headless: true,
      config: {
        video: false,
      },
      env: {
        evalId,
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

async function runEval(evalId) {
  const promptFilePath = "./evals/eval-001/prompt.md";
  const sourceDir = "./evals/eval-001/app";
  const targetDir = "./output/eval-001/app/" + (evalId || "0");

  try {
    await fs.ensureDir(targetDir);
    await fs.copy(sourceDir, targetDir);
    console.log("Directory copied successfully!");

    await runAgent(targetDir, fs.readFileSync(promptFilePath, "utf-8"));

    const results = await runCypressTests(evalId);
    console.log("Passed:", `${results.totalPassed}/${results.totalTests}`);
    console.log("Duration:", results.totalDuration);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function runEvals(batchSize) {
  const outputDir = "./output";
  await fs.remove(outputDir);
  console.log("Directory removed successfully!");

  const start = 0;
  const end = batchSize - 1;

  const evalPromises = [];

  for (let i = start; i <= end; i++) {
    evalPromises.push(runEval(i));
  }

  await Promise.all(evalPromises);
}

runEvals(10);
