// Helper to strip time from timestamp and return YYYY-MM-DD string
function getDateStr(timeStampStr) {
    const date = new Date(parseInt(timeStampStr));
    return date.toISOString().split('T')[0];
}

export function calculatedDailyPnl(fills, funding, state, startStr, endStr) {
    // 1. Initialize a map for our daily records
    const dailyData = {};

    // create empty records for every day in the range
    let current = new Date(startStr);
    const end = new Date(endStr);
    while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        dailyData[dateStr] = {
            date: dateStr,
            realized_pnl_usd: 0,
            unrealized_pnl_usd: 0,
            fees_usd: 0,
            funding_usd: 0,
            net_pnl_usd: 0,
            equity_usd: 0 // we will compute at the end
        };
        current.setDate(current.getDate() + 1);
    };

    // 2. process fills (trades and fees)
    fills.forEach(fill => {
        const dateStr = getDateStr(fill.time);
        if (dailyData[dateStr]) {
            // realized pnl is recorded on the trade
            dailyData[dateStr].realized_pnl_usd += parseFloat(fill.closedPnl || 0);

            // HyperLiquid records fees as positive strings on the fill
            dailyData[dateStr].fees_usd += parseFloat(fill.fee || 0);
        }
    });

    // 3. process funding
    funding.forEach(fund => {
        const dateStr = getDateStr(fund.time);
        if (dailyData[dateStr]) {
            // usdc value sent/received for funding
            dailyData[dateStr].funding_usd += parseFloat(fund.usdc || 0);
        }
    });

    // 4. transform map to array and calculate net pnl and equity
    const dailyArray = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));

    // get starting equity from the current user state
    // for true historical equity curve, we'd need to fetch their historical deposit/withdraw
    // for now we will use their current equity and work backwards/forwards

    let runningEquity = parseFloat(state.marginSummary.accountValue || 0);

    const summary = {
        total_realized_usd: 0,
        total_unrealized_usd: 0,
        total_fees_usd: 0,
        total_funding_usd: 0,
        net_pnl_usd: 0
    }

    dailyArray.forEach(day => {
        day.net_pnl_usd = day.realized_pnl_usd + day.unrealized_pnl_usd - day.fees_usd + day.funding_usd;

        summary.total_realized_usd += day.realized_pnl_usd;
        summary.total_fees_usd += day.fees_usd;
        summary.total_funding_usd += day.funding_usd;
        summary.net_pnl_usd += day.net_pnl_usd;

        runningEquity += day.net_pnl_usd;
        day.equity_usd = runningEquity;
    });

    return {
        daily: dailyArray,
        summary
    };
};