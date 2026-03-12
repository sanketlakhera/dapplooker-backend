import { describe, it, expect, vi } from "vitest";
import axios from 'axios';
import { getTokenData } from './coingecko.service.js';

vi.mock('axios');

describe('getTokenData', () => {
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