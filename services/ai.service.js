import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });


export async function getTokenInsight(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        // check for ```json in response if exists then remove and parse response
        let jsonString = text;
        if (text.includes("```json")) {
            jsonString = text.replace("```json", "").replace("```", "").trim();
        }
        const parsed = JSON.parse(jsonString);
        if (!parsed.reasoning || !parsed.sentiment) {
            throw new Error("AI response missing required fields");
        }
        return parsed;
    } catch (error) {
        throw error;
    }
}