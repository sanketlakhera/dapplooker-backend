import { describe, it, expect, vi, beforeEach } from "vitest";
import { getWalletPnlController } from './hyperliquid.controller.js';
import * as hyperliquidService from '../services/hyperliquid.service.js';
import * as pnlCalculator from '../utils/pnlCalculator.js';

vi.mock('../services/hyperliquid.service.js');
vi.mock('../utils/pnlCalculator.js');

describe("Hyperliquid controller", () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        vi.clearAllMocks();

        mockReq = {
            params: {},
            query: {}
        };

        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });

    it("should return 400 if wallet address invalid", async () => {
        mockReq.params.wallet = 'invalid-wallet';
        mockReq.query = { start: '2025-01-01', end: '2025-01-02' };

        await getWalletPnlController(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false
        }));
    });

    it('should return 400 if start date is after end date', async () => {
        mockReq.params.wallet = '0x1234567890123456789012345678901234567890';
        mockReq.query = { start: '2025-02-01', end: '2025-01-01' };
        await getWalletPnlController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: expect.objectContaining({ message: "Start date must be before end date" })
        }));
    });

    it('should return 200 and formatted data on success', async () => {
        mockReq.params.wallet = '0x1234567890123456789012345678901234567890';
        mockReq.query = { start: '2025-01-01', end: '2025-01-02' };
        // Mock Service responses
        hyperliquidService.getUserFills.mockResolvedValue([]);
        hyperliquidService.getUserFunding.mockResolvedValue([]);
        hyperliquidService.getUserState.mockResolvedValue({ marginSummary: { accountValue: '1000' } });
        // Mock Calculator response
        const mockCalcResult = {
            daily: [{ date: '2025-01-01', net_pnl_usd: 10 }],
            summary: { net_pnl_usd: 10 }
        };
        pnlCalculator.calculatedDailyPnl.mockReturnValue(mockCalcResult);
        await getWalletPnlController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            data: expect.objectContaining({
                wallet: mockReq.params.wallet,
                daily: mockCalcResult.daily,
                summary: mockCalcResult.summary
            })
        }));
    });
});