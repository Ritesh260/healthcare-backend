import SOS from "../models/sosModel.js";

// Create SOS entry (already there)
export const createSOS = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location data required" });
    }

    const newSOS = new SOS({ latitude, longitude });
    await newSOS.save();

    res.status(201).json({ message: "SOS saved successfully", sos: newSOS });
  } catch (error) {
    console.error("Error in SOS:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW: Fetch all SOS records
export const getAllSOS = async (req, res) => {
  try {
    const sosList = await SOS.find().sort({ timestamp: -1 });
    res.status(200).json(sosList);
  } catch (error) {
    console.error("Error fetching SOS data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
