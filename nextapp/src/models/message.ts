import mongoose from "mongoose";

const schema = new mongoose.Schema({
  sent: { type: mongoose.Types.ObjectId, required: true },
  chatId: { type: String, required: true },
  message: String
}, { timestamps: true });

const MessageModal = mongoose.models.message || mongoose.model("message", schema);

export default MessageModal