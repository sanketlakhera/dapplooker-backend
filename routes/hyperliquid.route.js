import { Router } from "express";
import { getWalletPnlController } from "../controllers/hyperliquid.controller.js";

const router = Router();

/**
 * @swagger
 * /api/hyperliquid/{wallet}/pnl:
 *   get:
 *     summary: Get daily PnL for a HyperLiquid wallet
 *     description: Fetches trades, funding, and positions to calculate daily Realized and Unrealized PnL, Fees, and Funding.
 *     parameters:
 *       - in: path
 *         name: wallet
 *         required: true
 *         schema:
 *           type: string
 *         description: HyperLiquid wallet address (0x...)
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daily PnL Breakdown
 *       400:
 *         description: Bad request (Invalid wallet or dates)
 *       500:
 *         description: Internal server error
 */
router.get("/:wallet/pnl", getWalletPnlController);

export default router;