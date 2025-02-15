const fs = require("fs").promises;
const chatbotService = require("../services/chatbot.service");
const ChatbotMessage = require("../models/chatbotMessage.model");

// We'll use multer in the route to handle file uploads.
// This controller expects a file (optional) and a query in the request.
exports.processChat = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assumes authentication middleware sets req.user
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query is required." });
    }

    // If a file is provided, read its content as UTF-8 text.
    let fileContent = "";
    if (req.file) {
      fileContent = await fs.readFile(req.file.path, "utf8");
    }

    // Build the combined prompt using the file content (if any) and the user query.
    const prompt = `
    You are StudySpace's Academic Assistant. Your task is to analyze provided academic material and answer user queries accurately and in detail.

    File Content:
    ${fileContent.trim() ? fileContent : "No additional material provided."}

    User Query:
    ${query}

    Instructions:
    - If academic material is provided, ensure your response is based on or references it when relevant.
    - Provide a clear, comprehensive, and informative answer.
    - If no file content is provided, rely solely on your knowledge and the user's query.
    - Format your response in well-structured paragraphs.

    Please generate a detailed answer accordingly.
    `;

    // Optionally, store the user’s query (with prompt details) in the DB.
    await ChatbotMessage.create({
      user: userId,
      role: "user",
      content: prompt,
    });

    // Get the chatbot response from Gemini via the Vercel AI SDK.
    const botResponse = await chatbotService.getBotResponse(prompt);

    // Save the bot's response in the DB.
    await ChatbotMessage.create({
      user: userId,
      role: "bot",
      content: botResponse,
    });

    // Return the response to the client.
    res.json({ answer: botResponse });
  } catch (error) {
    next(error);
  }
};
