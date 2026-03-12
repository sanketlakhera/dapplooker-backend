import { sendError } from "./apiResponse.js";


export function handleApiError(error, res) {
    // coingecko 404
    if (error.response?.status === 404) {
        return sendError(res, "Token not found on CoinGecko", 404);
    }

    // AI Validation Failure
    if (error.message === "AI response missing required fields") {
        return sendError(res, error.message, 502);
    }

    // missing api key
    if (error.message?.includes("not configured")) {
        return sendError(res, error.message, 503);
    }

    // fallback
    return sendError(res, "Internal server error", 500)
}