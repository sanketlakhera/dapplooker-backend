import { describe, it, expect, vi } from "vitest";

// mock all dependencies
vi.mock('../services/coingecko.service.js', () => ({
    getTokenData: vi.fn(),
    getMarketChart: vi.fn()
}));

vi.mock('../utils/promptBuilder.js', () => ({
    buildTokenPrompt: vi.fn(),
}));

vi.mock('../services/ai.service.js', () => ({
    getTokenInsight: vi.fn(),
}));

import { getTokenInsightController } from "./token.controller.js";
import { getMarketChart, getTokenData } from "../services/coingecko.service.js";
import { buildTokenPrompt } from "../utils/promptBuilder.js";
import { getTokenInsight } from "../services/ai.service.js";

function mockRes() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

describe('getTokenInsightController', () => {
    it('should return token data with AI insight', async () => {
        const req = { params: { id: 'bitcoin' }, body: { vs_currency: 'usd', history_days: 30 } };
        const res = mockRes();

        getTokenData.mockResolvedValue({
            id: 'bitcoin', symbol: 'btc', name: 'Bitcoin',
            current_price: 50000, market_cap: 1000000000,
            total_volume: 5000000000, price_change_24h: 2.5,
        });
        getMarketChart.mockResolvedValue([[1, 10], [2, 12]]);
        buildTokenPrompt.mockReturnValue('test prompt');
        getTokenInsight.mockResolvedValue({
            reasoning: 'Bull Market', sentiment: 'Bullish',
        });

        await getTokenInsightController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
        const responseData = res.json.mock.calls[0][0];
        expect(responseData.success).toBe(true);
        expect(responseData.data.token.id).toBe('bitcoin');
        expect(responseData.data.insight.sentiment).toBe('Bullish');
    });

    // coingecko error 404
    it('should return 404 when CoinGecko returns 404', async () => {
        const req = { params: { id: 'invalidToken' }, body: { vs_currency: 'usd', history_days: 30 } };
        const res = mockRes();

        const error = new Error('Not found');
        error.response = { status: 404 };
        getTokenData.mockRejectedValue(error);

        await getTokenInsightController(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // ai service failure
    it('should return 500 when AI service fails', async () => {
        const req = { params: { id: 'bitcoin' }, body: { vs_currency: 'usd', history_days: 30 } };
        const res = mockRes();

        getTokenData.mockResolvedValue({ id: 'bitcoin', name: 'Bitcoin' });
        buildTokenPrompt.mockReturnValue('prompt');
        getTokenInsight.mockRejectedValue(new Error("AI failed"));

        await getTokenInsightController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});