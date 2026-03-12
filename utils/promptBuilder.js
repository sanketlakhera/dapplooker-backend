export function buildTokenPrompt(tokenData, marketChartData) {
    if (!tokenData) throw new Error("Token data is required");

    let historyText = "";
    if (marketChartData && marketChartData?.length > 0) {
        // find highest and lowest prices in the period
        const prices = marketChartData.map(data => data[1]);
        const highestPrice = Math.max(...prices);
        const lowestPrice = Math.min(...prices);
        const days = Math.round((marketChartData[marketChartData.length - 1][0] - marketChartData[0][0]) / (1000 * 60 * 60 * 24));
        historyText = `
        Historical Context (${days} days);
        Highest Price: $${highestPrice.toFixed(4)}
        Lowest Price: $${lowestPrice.toFixed(4)}
        Current Trend vs ${days}d High: $${(((tokenData?.current_price - highestPrice) / highestPrice) * 100).toFixed(2)}
        `
    }
    const prompt = `Analyze the following crypto token market data.
    
    Token: ${tokenData?.name}
    Price: ${tokenData?.current_price}
    Market Cap: ${tokenData?.market_cap}
    Volume: ${tokenData?.total_volume}
    24h Change: ${tokenData?.price_change_24h}%
    ${historyText}

    Return JSON in the format:
    { "reasoning": "string", "sentiment": "Bullish | Neutral | Bearish" }`
    return prompt;
}   