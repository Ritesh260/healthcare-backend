import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, required: true, trim: true },
  message: { type: String, trim: true },
  type: { type: String, enum: ["contact","general"], default: "contact" },
  status: { type: String, enum: ["new","contacted","closed"], default: "new" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ContactRequest", contactRequestSchema);
