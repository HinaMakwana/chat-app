import mongoose from "mongoose";
import model from "../../config/model.js";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  ...model
});

const Message = mongoose.model("Message", messageSchema);

export default Message;