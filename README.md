# DappLooker Backend Assignment

## Overview

This project implements the backend APIs required for the Full Stack Engineer assignment. The service integrates external crypto data sources, generates AI insights, and calculates trading Profit & Loss (PnL) for wallets.

The system exposes two primary endpoints:

1. **Token Insight API** – Fetches token market data and generates an AI-based sentiment insight.
2. **HyperLiquid Wallet PnL API** – Calculates daily PnL for a wallet based on trading activity.

---

# Tech Stack

- **Node.js** – v24.1.0
- **Express.js** – REST API framework
- **Swagger** – API documentation
- **Vitest** – Unit testing
- **node-cache** – In-memory caching layer
- **Gemini AI (@google/generative-ai)** – AI Model

---

# Features

- RESTful API design
- Integration with external crypto market APIs
- AI-based token sentiment generation
- Daily PnL calculation for trading wallets
- In-memory caching using node-cache
- API documentation via Swagger
- Unit testing using Vitest

---

# Installation

### 1. Clone the repository

```bash
git clone https://github.com/sanketlakhera/dapplooker-backend.git
cd dapplooker-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file (you can use `.env.example` as a template if available). You'll need a free Gemini API key from Google AI Studio (https://aistudio.google.com/):

```
PORT=3001
GEMINI_API_KEY=your_key
GEMINI_MODEL_NAME=gemini-2.5-flash
```

### 4. Run the server

```bash
npm start
# or for development with auto-reload:
npm run watch
```

Server will start at:

```
http://localhost:3001
```

---

# API Documentation

Swagger UI is available at:

```
http://localhost:3001/api-docs
```

---

# API Endpoints

## 1. Token Insight API

Generates AI insight for a crypto token using market data.

```
POST /api/token/:id/insight
```

Example:

```
POST /api/token/chainlink/insight
```

Example Response:

```json
{
  "source": "coingecko",
  "token": {
    "id": "chainlink",
    "symbol": "LINK",
    "price": 7.23
  },
  "insight": {
    "reasoning": "Market shows moderate activity",
    "sentiment": "Neutral"
  },
  "model": {
    "provider": "google",
    "model": "gemini-2.5-flash"
  }
}
```

---

## 2. HyperLiquid Wallet PnL API

Calculates daily trading Profit and Loss for a wallet.

```
GET /api/hyperliquid/:wallet/pnl
```

Example:

```
GET /api/hyperliquid/0xabc123/pnl?start=2025-08-01&end=2025-08-03
```

Example Response:

```json
{
  "wallet": "0xabc123",
  "days": [
    {
      "date": "2025-08-01",
      "realized_pnl_usd": 120.5,
      "unrealized_pnl_usd": -15.3,
      "fees_usd": 2.1,
      "funding_usd": -0.5,
      "net_pnl_usd": 102.6
    }
  ]
}
```

---

# Caching

The project uses **node-cache** for in-memory caching to reduce repeated external API calls.

Cached data includes:

- Token market data
- HyperLiquid API responses

---

# Testing

Unit tests are implemented using **Vitest**.

Run tests with:

```bash
npm run test
```

---

# Project Structure

```
.
 ├── controllers
 ├── routes
 ├── services
 ├── utils
 ├── index.js
 ├── package.json
 └── README.md
```

Note: Unit tests (`*.test.js`) are placed alongside the corresponding source files in their respective folders.