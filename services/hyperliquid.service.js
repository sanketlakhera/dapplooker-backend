import axios from "axios";

const HYPERLIQUID_INFO_URL = "https://api.hyperliquid.xyz/info";

export async function getUserFills(wallet) {
    try {
        const response = await axios.post(HYPERLIQUID_INFO_URL, {
            type: 'userFills',
            user: wallet
        });
        // returns an array of filled trade objects
        return response.data;
    } catch (error) {
        console.log("HyperLiquid userFills error: ", error?.message);
        throw error;
    }
};

export async function getUserFunding(wallet, startTime, endTime) {
    try {
        const response = await axios.post(HYPERLIQUID_INFO_URL, {
            type: 'userFunding',
            user: wallet,
            startTime, // unix timestamp
            endTime // unix timestamp
        });
        // returns an array of funding payment objects
        return response.data;
    } catch (error) {
        console.log("HyperLiquid userFunding error: ", error?.message);
        throw error;
    }
};

export async function getUserState(wallet) {
    try {
        const response = await axios.post(HYPERLIQUID_INFO_URL, {
            type: 'clearinghouseState',
            user: wallet
        });
        // returns account equity and an array of open positions (assetPositions)
        return response.data;
    } catch (error) {
        console.log("HyperLiquid clearinghouseState error: ", error?.message);
        throw error;
    }
};

export async function getAssetMetadata() {
    try {
        const response = await axios.post(HYPERLIQUID_INFO_URL, {
            type: 'meta'
        });
        // returns the universe of coins. we need this to map coin index (eg 0) to coin name (eg BTC)
        return response.data;
    } catch (error) {
        console.log("HyperLiquid meta error", error?.message)
        throw error;
    }
}