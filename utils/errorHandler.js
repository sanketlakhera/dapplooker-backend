import { sendError } from "./apiResponse.js";


export function handleApiError(error, res) {
    // Zod validation error
    if (error.name === 'ZodError') {
        return sendError(res, error.issues?.[0]?.message || "Validation failed", 400);
    }
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