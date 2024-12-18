import mongoose from "mongoose";
import model from "../../config/model.js";

const conversationSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
						default: [],
        },
    ],
		...model
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;