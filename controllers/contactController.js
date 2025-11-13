import ContactRequest from "../models/ContactRequest.js";

export const createRequest = async (req, res) => {
  try {
    const { name, email, phone, message, type } = req.body;
    if(!name || !phone) return res.status(400).json({ msg: "Name & phone required" });

    const reqDoc = new ContactRequest({ name, email, phone, message, type: type || "callback" });
    await reqDoc.save();
    res.status(201).json({ msg: "Request saved", data: reqDoc });
  } catch(err) {
    res.status(500).json({ msg: "Server error" });
  }
};
