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
  let results = {};

  try {
    await fs.ensureDir(targetDir);
    await fs.copy(sourceDir, targetDir);
    console.log("Directory copied successfully!");

    await runAgent(targetDir, fs.readFileSync(promptFilePath, "utf-8"));

    const results = await runCypressTests(evalId);
    console.log(
      `[001-${evalId}] Passed: ${results.totalPassed}/${results.totalTests}`
    );
    console.log(`[001-${evalId}] Duration: ${results.totalDuration}`);
    return { [evalId]: results.totalPassed === results.totalTests };
  } catch (error) {
    console.error("Error:", error);
  }
}

function generateBoxes(inputObj) {
  let html = "";

  for (let key in inputObj) {
    if (inputObj.hasOwnProperty(key)) {
      const value = inputObj[key];
      const boxColor = value ? "green" : "red";
      html += `<div style="background-color: ${boxColor}; width: 50px; height: 50px; display: inline-block; margin: 5px; border: 2px solid #333;"></div>`;
    }
  }

  return html;
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

  const results = await Promise.all(evalPromises);

  const mergedResults = results.reduce((result, currentObject) => {
    for (let key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        result[key] = currentObject[key];
      }
    }
    return result;
  }, {});

  fs.writeFileSync(outputDir + "/results.html", generateBoxes(mergedResults));
}

runEvals(10);
