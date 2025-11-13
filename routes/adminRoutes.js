import express from "express";
import { getAllData } from "../controllers/adminController.js";

const router = express.Router();

// GET all data for admin dashboard
router.get("/all-data", getAllData);

export default router;
