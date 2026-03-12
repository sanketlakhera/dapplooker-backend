

export function buildTokenPrompt(tokenData) {
    const prompt = `Analyze the following crypto token market data.
    
    Token: ${tokenData.name}
    Price: ${tokenData?.current_price}
    Market Cap: ${tokenData?.market_cap}
    Volume: ${tokenData?.total_volume}
    24h Change: ${tokenData?.price_change_24h}

    Return JSON in the format:
    {
        "reasoning": "string",
        "sentiment": "Bullish | Neutral | Bearish"
    }`
    return prompt;
}