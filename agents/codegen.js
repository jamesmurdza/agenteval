const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const fs = require("fs");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function modifyCode(sourceCode, prompt) {
  try {
    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "*index.html*```\n" +
            sourceCode +
            "\n```\n\n" +
            prompt +
            "\n\nReturn the entire contents of the new index.html.",
        },
      ],
      temperature: 0.2, // Adjust as per your preference
      n: 1,
    });

    const modifiedCode = gptResponse.data.choices[0].message.content.trim();
    const cleanedCode = modifiedCode.replace(/^`{3}(\n)?|(\n)?`{3}$/g, "");
    return cleanedCode;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function run(targetDir, prompt) {
  try {
    const filePath = `${targetDir}/index.html`;
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const modifiedContent = await modifyCode(fileContent, prompt);
    await fs.promises.writeFile(filePath, modifiedContent, "utf-8");

    console.log("File modified successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { run };
