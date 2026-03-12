import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getUserFills, getUserFunding, getUserState } from "./hyperliquid.service.js";

vi.mock('axios');

describe("Hyperliquid Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getUserFills makes correct POST request", async () => {
        const mockWallet = "0x123";
        const mockData = [{ closedPnl: '10' }];
        axios.post.mockResolvedValue({ data: mockData });

        const result = await getUserFills(mockWallet);

        expect(axios.post).toHaveBeenCalledWith('https://api.hyperliquid.xyz/info', { type: 'userFills', user: mockWallet });
        expect(result).toEqual(mockData);
    });

    it("getUserFunding makes correct POST request", async () => {
        const mockWallet = "0x123";
        const mockData = [{ usdc: '10' }];
        axios.post.mockResolvedValue({ data: mockData });

        const result = await getUserFunding(mockWallet);

        expect(axios.post).toHaveBeenCalledWith('https://api.hyperliquid.xyz/info', { type: 'userFunding', user: mockWallet });
        expect(result).toEqual(mockData);
    });

    it("getUserState makes correct POST request", async () => {
        const mockWallet = "0x123";
        const mockData = [{ marginSummary: { accountValue: '10' } }];
        axios.post.mockResolvedValue({ data: mockData });

        const result = await getUserState(mockWallet);

        expect(axios.post).toHaveBeenCalledWith('https://api.hyperliquid.xyz/info', { type: 'clearinghouseState', user: mockWallet });
        expect(result).toEqual(mockData);
    });

    it("getAssetMetadata makes correct POST request", async () => {
        const mockData = [{ name: 'BTC' }];
        axios.post.mockResolvedValue({ data: mockData });

        const result = await import('./hyperliquid.service.js').then(m => m.getAssetMetadata());

        expect(axios.post).toHaveBeenCalledWith('https://api.hyperliquid.xyz/info', { type: 'meta' });
        expect(result).toEqual(mockData);
    });
});