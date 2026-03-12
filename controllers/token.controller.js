import { getTokenData, getMarketChart } from '../services/coingecko.service.js';
import { buildTokenPrompt } from '../utils/promptBuilder.js';
import { getTokenInsight } from '../services/ai.service.js';
import { handleApiError } from '../utils/errorHandler.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { tokenInsightRequestSchema } from '../utils/schemas.js';


export async function getTokenInsightController(req, res) {
    try {
        const tokenId = req.params.id;
        if (!tokenId) {
            return sendError(res, "Token ID is required", 400);
        }
        // validate optional request body
        const body = tokenInsightRequestSchema.parse(req.body);
        const tokenData = await getTokenData(tokenId);
        const marketChartData = await getMarketChart(tokenId, body.history_days, body.vs_currency);
        if (!tokenData) {
            return sendError(res, "Token not found", 404);
        }
        const prompt = buildTokenPrompt(tokenData, marketChartData);
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