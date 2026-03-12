import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// routes import
import tokenRoute from "./routes/token.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.use("/api/token", tokenRoute);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
