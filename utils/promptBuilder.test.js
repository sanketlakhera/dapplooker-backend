import { describe, it, expect, vi } from "vitest";
import { buildTokenPrompt } from "./promptBuilder.js";

describe('buildTokenPrompt', () => {
    it('should return a prompt string with token data', () => {
        const tokenData = {
            name: 'Chainlink',
            current_price: 7.23,
            market_cap: 3500000000,
            total_volume: 120000000,
            price_change_24h: -1.2
        }
        const marketChartData = [
            [1700000000000, 10],
            [1670086400000, 12]
        ]

        const prompt = buildTokenPrompt(tokenData, marketChartData);

        // assert its a string
        expect(typeof prompt).toBe('string');
        // assert it contains the token name
        expect(prompt).toContain('Chainlink');
        // assert it contains price
        expect(prompt).toContain(7.23);
        // assert it asks for json format
        expect(prompt).toContain('reasoning');
        expect(prompt).toContain('sentiment');
    });

    it('should handle missing fields gracefully', () => {
        const tokenData = { name: 'Bitcoin' };
        const marketChartData = [
            [1700000000000, 10],
            [1670086400000, 12]
        ]
        const prompt = buildTokenPrompt(tokenData, marketChartData);
        expect(prompt).toContain('Bitcoin');
        expect(prompt).toContain('undefined'); // missing fields show as undefined
    });

    it('should handle undefined tokenData', () => {
        expect(() => buildTokenPrompt(undefined)).toThrow();
    })
});