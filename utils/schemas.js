import { z } from 'zod';

// Request body schema for POST /api/token/:id/insight
export const tokenInsightRequestSchema = z.object({
    vs_currency: z.string().default('usd'),
    history_days: z.number().int().positive().default(30),
}).optional();

// AI response schema - validates structured output from Gemini
export const aiResponseSchema = z.object({
    reasoning: z.string(),
    sentiment: z.enum(['Bullish', 'Neutral', 'Bearish']),
});

// CoinGecko extracted token data schema
export const tokenDataSchema = z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    current_price: z.number(),
    market_cap: z.number(),
    total_volume: z.number(),
    price_change_24h: z.number(),
});

// validates hyperliquid pnl request parameters
export const hyperliquidPnlRequestSchema = z.object({
    wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM wallet address"),
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD"),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be YYYY-MM-DD"),
});