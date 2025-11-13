import User from "../models/User.js";
import Contact from "../models/ContactRequest.js";
import Callback from "../models/Callback.js";

export const getAllData = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const callbacks = await Callback.find().sort({ createdAt: -1 });

    res.status(200).json({ users, contacts, callbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
