const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");

/**
 * Calls Gemini via the Vercel AI SDK to generate a response.
 * @param {string} prompt - The combined prompt (file content + query).
 * @returns {Promise<string>} - The generated response from Gemini.
 */
exports.getBotResponse = async (prompt) => {
  try {
    // Create a model instance for Gemini (using model id "gemini-1.5-pro-latest")
    const model = google("gemini-2.0-flash", {
      // You can add provider-specific options here if needed.
      // For example, safetySettings or structuredOutputs.
    });

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 150, // Adjust token limit as needed
    });

    return text;
  } catch (error) {
    console.error(
      "Error calling Gemini via Vercel AI SDK:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to get response from Gemini");
  }
};
