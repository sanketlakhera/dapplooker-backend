import axios from 'axios';
import { tokenDataSchema } from '../utils/schemas.js';

export async function getTokenData(tokenId) {
    try {
        // optional query params to reduce payload
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&community_data=false&developer_data=false`);
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
        // validate extracted data with Zod schema
        return tokenDataSchema.parse(tokenData);
    } catch (error) {
        console.log("CoinGecko API error:", error?.message);
        throw error;
    }
}

export async function getMarketChart(tokenId, days = 30, currency = 'usd') {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=${currency}&days=${days}`);
        const { data } = response;
        return data.prices;
    } catch (error) {
        console.log("CoinGecko API error:", error?.message);
        throw error;
    }
}