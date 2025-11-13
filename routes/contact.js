import express from "express";
import { createRequest } from "../controllers/contactController.js";

const router = express.Router();

router.post("/request", createRequest);

export default router;
