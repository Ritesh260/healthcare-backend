import mongoose from "mongoose";

const callbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Callback = mongoose.model("Callback", callbackSchema);
export default Callback;

