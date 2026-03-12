import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from 'axios';
import { getTokenData, myCache } from './coingecko.service.js';

vi.mock('axios');

describe('getTokenData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        myCache.flushAll();
    });
    it('should return extracted token data', async () => {
        axios.get.mockResolvedValue({
            data: {
                id: 'bitcoin',
                symbol: 'btc',
                name: 'Bitcoin',
                market_data: {
                    current_price: { usd: 50000 },
                    market_cap: { usd: 1000000000 },
                    total_volume: { usd: 500000000 },
                    price_change_percentage_24h: 2.5,
                }
            }
        });

        const result = await getTokenData('bitcoin');

        expect(result.id).toBe('bitcoin');
        expect(result.current_price).toBe(50000);
        expect(result.price_change_24h).toBe(2.5);
    });

    it('sould throw on invalid token id', async () => {
        axios.get.mockRejectedValue({
            response: { status: 404 },
            message: 'Request failed with status code 404'
        });

        await expect(getTokenData('invalidToken')).rejects.toThrow();
    });

    it('should throw on network error', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        await expect(getTokenData('bitcoin')).rejects.toThrow('Network error');
    });
});

describe('getMarketChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        myCache.flushAll();
    });

    it('should return market chart prices', async () => {
        const mockPrices = [[1620000000000, 50000], [1620086400000, 51000]];
        axios.get.mockResolvedValue({
            data: { prices: mockPrices }
        });

        const { getMarketChart } = await import('./coingecko.service.js');
        const result = await getMarketChart('bitcoin', 30, 'usd');

        expect(result).toEqual(mockPrices);
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('bitcoin/market_chart'));
    });

    it('should throw on api error', async () => {
        axios.get.mockRejectedValue(new Error('API error'));

        const { getMarketChart } = await import('./coingecko.service.js');
        await expect(getMarketChart('bitcoin')).rejects.toThrow('API error');
    });
});