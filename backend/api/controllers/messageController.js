import { HTTP_STATUS_CODE } from "../../config/constants.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";


export const sendMessage = async (req,res) => {
	try {
		const {message,receiverId} = req.body;

		const senderId = req.me._id;

		let conversation = await Conversation.findOne({
			members:{$all:[senderId,receiverId]}
		})

		if(!conversation) {
			conversation = await Conversation.create({
				members:[senderId,receiverId],
			})
		}

		const newMessage = await Message.create({
			senderId,
			receiverId,
			message
		})

		if(newMessage){
			conversation.messages.push(newMessage._id);
		}
		await conversation.save();
		//socket functionality
		const receiverSocketId = getReceiverSocketId(receiverId)
		console.log(receiverSocketId);

		if(receiverSocketId){
			io.to(receiverSocketId).emit("newMessage",newMessage)
		}

		return res.status(HTTP_STATUS_CODE.OK).json({
			status: HTTP_STATUS_CODE.OK,
			data: newMessage,
			error: '',
		});
	} catch (error) {
		console.log(error);
		return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
			status: HTTP_STATUS_CODE.SERVER_ERROR,
			data: {},
			error: error.message,
		});
	}
}

export const getMessages = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.me._id;

		const conversation = await Conversation.findOne({
			members: { $all: [userId, id] },
		}).populate("messages");

		// if (!conversation) {
		// 	return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
		// 		status: HTTP_STATUS_CODE.NOT_FOUND,
		// 		data: {},
		// 		error: "Conversation not found",
		// 	});
		// }

		return res.status(HTTP_STATUS_CODE.OK).json({
			status: HTTP_STATUS_CODE.OK,
			message: 'get conversation',
			data: conversation?.messages || [],
			error: '',
		});
	} catch (error) {
		return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
			status: HTTP_STATUS_CODE.SERVER_ERROR,
			data: {},
			error: error.message,
		});
	}
}