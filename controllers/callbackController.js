import Callback from "../models/Callback.js";

// POST /api/callback/request
export const requestCallback = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ msg: "Name and phone are required" });
    }

    const newRequest = new Callback({ name, phone });
    await newRequest.save();

    res.status(201).json({ msg: "Callback request saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

