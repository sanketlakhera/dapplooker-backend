import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiResponseSchema } from "../utils/schemas.js";

let model;

function getModel() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }
    if (!process.env.GEMINI_MODEL_NAME) {
        throw new Error("GEMINI_MODEL_NAME is not configured");
    }
    if (!model) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL_NAME });
    }
    return model;
}

export async function getTokenInsight(prompt) {
    const result = await getModel().generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // check for ```json in response if exists then remove and parse response
    let jsonString = text;
    if (text.includes("```json")) {
        jsonString = text.replace("```json", "").replace("```", "").trim();
    }
    const parsed = JSON.parse(jsonString);
    // validate AI response with Zod schema
    return aiResponseSchema.parse(parsed);
}