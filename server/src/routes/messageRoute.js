import { config } from "dotenv";
import express from "express";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import Goods from "../models/goodsModel.js";

config();
const router = express.Router();

router.post("/", async (req, res) => {
  const userMessage = req.body;
  const aiMessages = await createAIMessages(userMessage);
  res.status(200).json(aiMessages);
});

async function createAIMessages(userMessage) {
  const newMessage = await run(userMessage.content);
  console.log(newMessage);
  const aiMessage = {
    content: newMessage,
    className: "incoming",
    type: "text",
  };
  const messageList = [];
  messageList.push(aiMessage);
  return messageList;
}

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(input) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const data = JSON.stringify(await Goods.find({}));
  const schema = JSON.stringify(Goods.schema);
  const prompt = `This is the data of this collection: ${data}, process the user input ${input} and translate the response into a concise and sophisticated human-readable description. Add the currency VNĐ after a price`;

  const result = await chatSession.sendMessage(prompt);
  const response = result.response;
  console.log(response);
  return response.text();
}

export default router;
