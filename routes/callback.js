import express from "express";
import { requestCallback } from "../controllers/callbackController.js";

const router = express.Router();

router.post("/request", requestCallback);

export default router;
