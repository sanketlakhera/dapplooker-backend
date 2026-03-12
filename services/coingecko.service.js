import axios from 'axios';
import { tokenDataSchema } from '../utils/schemas.js';
import NodeCache from 'node-cache';

// intialize cache with ttl of 3 minutes (180 seconds)
export const myCache = new NodeCache({ stdTTL: 180 });

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

export async function getTokenData(tokenId) {
    const cacheKey = `tokenData_${tokenId}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // optional query params to reduce payload
        const response = await axios.get(`${COINGECKO_API_URL}/coins/${tokenId}?localization=false&tickers=false&community_data=false&developer_data=false`);
        const { data } = response;
        const tokenData = {
            id: data?.id,
            symbol: data?.symbol,
            name: data?.name,
            current_price: data?.market_data?.current_price?.usd,
            market_cap: data?.market_data?.market_cap?.usd,
            total_volume: data?.market_data?.total_volume?.usd,
            price_change_24h: data?.market_data?.price_change_percentage_24h,
        };
        myCache.set(cacheKey, tokenData);
        // validate extracted data with Zod schema
        return tokenDataSchema.parse(tokenData);
    } catch (error) {
        if (error.response?.status === 404) {
            console.log(`CoinGecko API error: Token ${tokenId} not found`);
        } else {
            console.log("CoinGecko Service error:", error?.message);
        }
        throw error;
    }
}

export async function getMarketChart(tokenId, days = 30, currency = 'usd') {
    const cacheKey = `marketChart_${tokenId}_${currency}_${days}`;
    const cachedData = myCache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=${currency}&days=${days}`);
        const { data } = response;
        myCache.set(cacheKey, data.prices);
        return data.prices;
    } catch (error) {
        console.log("CoinGecko API error:", error?.message);
        throw error;
    }
}