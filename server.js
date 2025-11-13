import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import callbackRoutes from "./routes/callback.js";
import adminRoutes from "./routes/adminRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// -------------------------
// MongoDB Connection
// -------------------------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// -------------------------
// API Routes for Auth & Contact
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/callback", callbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sos", sosRoutes);

// -------------------------
// OSM/Overpass API for Hospitals & Ambulances
// -------------------------

const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

async function fetchOverpass(query) {
  for (let server of OVERPASS_SERVERS) {
    try {
      const url = `${server}?data=${encodeURIComponent(query)}`;
      const response = await fetch(url, { timeout: 10000 });
      const text = await response.text();
      if (text.trim().startsWith("{")) return JSON.parse(text);
    } catch (err) {
      console.warn(`Error fetching from ${server}:`, err.message);
    }
  }
  return null;
}

function formatOSMResults(elements) {
  if (!elements) return [];
  return elements.map(el => ({
    name: el.tags?.name || "Hospital/Ambulance",
    vicinity: el.tags?.["addr:street"] || "Address not available",
    geometry: { location: { lat: el.lat, lng: el.lon } }
  }));
}

// Nearby Hospitals
app.get("/api/hospitals", async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 2000;
  const query = `[out:json];node(around:${radius},${lat},${lng})["amenity"="hospital"];out;`;

  try {
    const data = await fetchOverpass(query);
    if (data?.elements) res.json({ results: formatOSMResults(data.elements) });
    else res.json({
      results: [{ name: "Sample Hospital", vicinity: "Mumbai", geometry: { location: { lat: 19.076, lng: 72.877 } } }]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ results: [] });
  }
});

// Nearby Ambulances
app.get("/api/ambulances", async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 2000;
  const query = `[out:json];node(around:${radius},${lat},${lng})["emergency"="ambulance"];out;`;

  try {
    const data = await fetchOverpass(query);
    if (data?.elements) res.json({ results: formatOSMResults(data.elements) });
    else res.json({
      results: [{ name: "Sample Ambulance", vicinity: "Mumbai", geometry: { location: { lat: 19.076, lng: 72.877 } } }]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ results: [] });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
