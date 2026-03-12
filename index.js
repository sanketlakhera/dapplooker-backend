import dotenv from "dotenv";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
dotenv.config();

import express from "express";
import cors from "cors";

// routes import
import tokenRoute from "./routes/token.route.js";
import hyperliquidRoute from "./routes/hyperliquid.route.js";

// Swagger configuration
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DappLooker API',
            version: '1.0.0',
            description: 'Backend service for Token Insights and HyperLiquid Wallet PnL',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    },
    apis: ['./routes/*.js'],
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve raw Swagger JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.use("/api/token", tokenRoute);
app.use("/api/hyperliquid", hyperliquidRoute);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
