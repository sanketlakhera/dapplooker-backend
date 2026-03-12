import { Router } from "express";
import { getTokenInsightController } from "../controllers/token.controller.js";

const router = Router();

/**
 * @swagger
 * /api/token/{id}/insight:
 *   post:
 *     summary: Get AI-generated insight for a crypto token
 *     description: Fetches token market data from CoinGecko and generates AI-powered sentiment analysis
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: CoinGecko token ID (e.g. bitcoin, ethereum, chainlink)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vs_currency:
 *                 type: string
 *                 default: usd
 *                 description: Target currency for market data
 *               history_days:
 *                 type: integer
 *                 default: 30
 *                 description: Number of days of historical data to include
 *     responses:
 *       200:
 *         description: Token data with AI insight
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                   example: coingecko
 *                 token:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: chainlink
 *                     symbol:
 *                       type: string
 *                       example: link
 *                     name:
 *                       type: string
 *                       example: Chainlink
 *                     current_price:
 *                       type: number
 *                       example: 7.23
 *                     market_cap:
 *                       type: number
 *                       example: 3500000000
 *                     total_volume:
 *                       type: number
 *                       example: 120000000
 *                     price_change_24h:
 *                       type: number
 *                       example: -1.2
 *                 insight:
 *                   type: object
 *                   properties:
 *                     reasoning:
 *                       type: string
 *                       example: Market stable with moderate volume
 *                     sentiment:
 *                       type: string
 *                       enum: [Bullish, Neutral, Bearish]
 *                       example: Neutral
 *                 model:
 *                   type: object
 *                   properties:
 *                     provider:
 *                       type: string
 *                       example: google
 *                     model:
 *                       type: string
 *                       example: gemini-2.5-flash
 *       400:
 *         description: Bad request - Token ID is required
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/insight", getTokenInsightController);

export default router;