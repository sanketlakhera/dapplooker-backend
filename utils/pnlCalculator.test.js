import { describe, it, expect } from "vitest";
import { calculatedDailyPnl } from "./pnlCalculator.js";

describe("PnL calculator", () => {
    it("aggregates daily pnl, fees, and funding correctly", () => {
        const startStr = '2025-01-01';
        const endStr = '2025-01-02';

        const mockState = {
            marginSummary: { accountValue: '1000' }
        };

        const mockFills = [
            { time: new Date('2025-01-01T10:00:00Z').getTime(), closedPnl: '50', fee: '1' },
            { time: new Date('2025-01-01T15:00:00Z').getTime(), closedPnl: '20', fee: '0.5' },
            { time: new Date('2025-01-02T10:00:00Z').getTime(), closedPnl: '-10', fee: '0.5' }
        ]

        const mockFunding = [
            { time: new Date('2025-01-01T12:00:00Z').getTime(), usdc: '-2' },
            { time: new Date('2025-01-02T12:00:00Z').getTime(), usdc: '3' }
        ];

        const result = calculatedDailyPnl(mockFills, mockFunding, mockState, startStr, endStr);

        //verify daily array
        expect(result.daily).toHaveLength(2);
        // Day 1 Checks: Realized 70, Fee 1.5, Funding -2. Net = 70 - 1.5 + (-2) = 66.5
        expect(result.daily[0].date).toBe('2025-01-01');
        expect(result.daily[0].realized_pnl_usd).toBe(70);
        expect(result.daily[0].fees_usd).toBe(1.5);
        expect(result.daily[0].funding_usd).toBe(-2);
        expect(result.daily[0].net_pnl_usd).toBe(66.5);
        expect(result.daily[0].equity_usd).toBe(1066.5); // 1000 + 66.5
        // Day 2 Checks: Realized -10, Fee 0.5, Funding 3. Net = -10 - 0.5 + 3 = -7.5
        expect(result.daily[1].date).toBe('2025-01-02');
        expect(result.daily[1].realized_pnl_usd).toBe(-10);
        expect(result.daily[1].net_pnl_usd).toBe(-7.5);
        expect(result.daily[1].equity_usd).toBe(1059); // 1066.5 - 7.5
        // Verify Summary
        expect(result.summary.total_realized_usd).toBe(60); // 70 - 10
        expect(result.summary.total_fees_usd).toBe(2);      // 1.5 + 0.5
        expect(result.summary.total_funding_usd).toBe(1);   // -2 + 3
        expect(result.summary.net_pnl_usd).toBe(59);        // 66.5 - 7.5
    });

    it("handles fills and funds with undefined or missing numeric strings gracefully", () => {
        const startStr = '2025-01-01';
        const endStr = '2025-01-01';
        const mockState = { marginSummary: {} }; // no accountValue
        
        const mockFills = [
            { time: new Date('2025-01-01T10:00:00Z').getTime() } // missing closedPnl and fee
        ]
        const mockFunding = [
            { time: new Date('2025-01-01T12:00:00Z').getTime() } // missing usdc
        ];

        const result = calculatedDailyPnl(mockFills, mockFunding, mockState, startStr, endStr);
        
        expect(result.daily[0].realized_pnl_usd).toBe(0);
        expect(result.daily[0].fees_usd).toBe(0);
        expect(result.daily[0].funding_usd).toBe(0);
        expect(result.daily[0].net_pnl_usd).toBe(0);
        expect(result.daily[0].equity_usd).toBe(0);
        expect(result.summary.net_pnl_usd).toBe(0);
    });
});