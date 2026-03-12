import { getUserFills, getUserFunding, getUserState } from "../services/hyperliquid.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { handleApiError } from "../utils/errorHandler.js";
import { calculatedDailyPnl } from "../utils/pnlCalculator.js";
import { hyperliquidPnlRequestSchema } from "../utils/schemas.js";


export async function getWalletPnlController(req, res) {
    try {
        // validate request params
        const { wallet } = req.params;
        const { start, end } = req.query;

        hyperliquidPnlRequestSchema.parse({ wallet, start, end });

        // convert date to timestamp in milliseconds
        const startTimeTs = new Date(start).getTime();
        const endTimeTs = new Date(end).setUTCHours(23, 59, 59, 999);

        if (startTimeTs > endTimeTs) {
            throw new Error("Start date must be before end date");
        }
        // fetch all required data concurrently
        const [fills, funding, state] = await Promise.all([
            getUserFills(wallet),
            getUserFunding(wallet, startTimeTs, endTimeTs),
            getUserState(wallet)
        ]);

        const pnlData = calculatedDailyPnl(fills, funding, state, start, end);

        const response = {
            wallet,
            start,
            end,
            daily: pnlData.daily,
            summary: pnlData.summary,
            diagnostics: {
                data_source: 'hyperliquid_api',
                last_api_call: new Date().toISOString(),
                notes: "unrealized PnL calculation simplified for this aggregate. Start equity approximated from current margin."
            }
        };

        return sendSuccess(res, response);

    } catch (error) {
        console.log("HyperLiquid controller Error: ", error?.message);
        if (error.message === "Start date must be before end date") {
            return res.status(400).json({
                success: false,
                error: {
                    message: error.message,
                    statusCode: 400
                }
            });
        }
        return handleApiError(error, res);
    }
}