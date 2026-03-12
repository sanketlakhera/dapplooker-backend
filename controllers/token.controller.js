import { getTokenData } from '../services/coingecko.service.js';
import { buildTokenPrompt } from '../utils/promptBuilder.js';
import { getTokenInsight } from '../services/ai.service.js';
import { handleApiError } from '../utils/errorHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';


export async function getTokenInsightController(req, res) {
    try {
        const tokenId = req.params.id;
        if (!tokenId) {
            return sendError(res, "Token ID is required", 400); //res.status(400).json({ message: "Token ID is required" });
        }
        const tokenData = await getTokenData(tokenId);
        if (!tokenData) {
            return sendError(res, "Token not found", 404); //res.status(404).json({ message: "Token not found" });
        }
        const prompt = buildTokenPrompt(tokenData);
        const insight = await getTokenInsight(prompt);
        const response = {
            source: "coingecko",
            token: {
                id: tokenData.id,
                symbol: tokenData.symbol,
                name: tokenData.name,
                current_price: tokenData.current_price,
                market_cap: tokenData.market_cap,
                total_volume: tokenData.total_volume,
                price_change_24h: tokenData.price_change_24h,
            },
            insight: {
                reasoning: insight.reasoning,
                sentiment: insight.sentiment,
            },
            model: {
                provider: "google", model: "gemini-2.5-flash"
            }
        };
        return sendSuccess(res, response);
    } catch (error) {
        console.log("Error:", error?.message);
        return handleApiError(error, res);
    }
}