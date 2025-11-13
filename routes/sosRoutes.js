import express from "express";
import { createSOS, getAllSOS } from "../controllers/sosController.js";

const router = express.Router();

// Create SOS entry
router.post("/", createSOS);

// ✅ Fetch all SOS entries
router.get("/", getAllSOS);

export default router;

