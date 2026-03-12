import { Router } from "express";
import { getTokenInsightController } from "../controllers/token.controller.js";

const router = Router();

router.post("/:id/insight", getTokenInsightController);

export default router;