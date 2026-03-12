import { getTokenData } from '../services/coingecko.service.js';
import { buildTokenPrompt } from '../utils/promptBuilder.js';
import { getTokenInsight } from '../services/ai.service.js';


export async function getTokenInsightController(req, res) {
    try {
        const tokenId = req.params.id;
        if (!tokenId) {
            return res.status(400).json({ message: "Token ID is required" });
        }
        const tokenData = await getTokenData(tokenId);
        if (!tokenData) {
            return res.status(404).json({ message: "Token not found" });
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
        return res.status(200).json(response);
    } catch (error) {
        console.log("Error:", error?.message);
        if (error.response?.status === 404) {
            return res.status(404).json({
                message: "Token not found on CoinGecko"
            });
        }
        if (error.message === "AI response missing required fields") {
            return res.status(502).json({
                message: "AI returned invalid response"
            });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}