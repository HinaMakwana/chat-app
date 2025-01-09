import { DRIVERS, HTTP_STATUS_CODE, STATUS } from "../../config/constants.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
import { storageCore } from "../helpers/storage/core/core.js";
import Conversation from "../models/conversation.js";
import Media from "../models/Media.js";
import Message from "../models/message.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const { message, receiverId, attachments, replyTo } = req.body;

    const senderId = req.me._id;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId], $size: 2 },
      isDeleted: false,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    let messageData = {
      _id: newMessage._id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      message: newMessage.message,
      attachments: [],
      createdAt: newMessage.createdAt,
    };

    if (replyTo) {
      const replyMessage = await Message.findById({ _id: replyTo }).populate('attachments');
      if (!replyMessage) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          data: {},
          error: "Reply message not found",
        });
      }

      newMessage.replyTo = replyTo;
      messageData.replyTo = replyMessage;
    }

    const attachmentData = [];
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const { mediaId } = attachment;

        const media = await Media.findById(mediaId).select("fileName url");
        if (!media) {
          return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            data: {},
            error: "Attachment not found",
          });
        }

        attachmentData.push({
          mediaId,
          messageId: newMessage._id,
        });

        await Media.updateOne(
          { _id: mediaId },
          {
            $set: {
              status: STATUS.MEDIA.ATTACHED,
            },
          }
        );

        messageData.attachments.push(media);
        newMessage.attachments.push(media);
      }
    }

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await conversation.save();
    await newMessage.save();

    //socket functionality
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      data: messageData,
      error: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      data: {},
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.me._id;

    // const userIdObject = new mongoose.Types.ObjectId(userId);
    // const idObject = new mongoose.Types.ObjectId(id);

    const conversation = await Conversation.findOne({
      $and: [
        { members: { $all: [userId, id] } }, // Check if the elements exist
        { $expr: { $eq: [{ $size: "$members" }, 2] } }, // Ensure array size matches exactly
      ],
      isDeleted: false,
    })
      .select("messages")
      .populate([
        {
          path: "messages", // Populate messages
          select: "senderId receiverId message attachments createdAt replyTo", // Select specific fields for messages
          populate: [
            {
              path: "attachments", // Nested populate for attachments inside each message
              select: "url fileName filePath originalName", // Select specific fields from the attachments
            },
            {
              path: "replyTo", // Nested populate for replyTo inside each message
              select: "message attachments", // Select specific fields for the replyTo
              populate: {
                path: "attachments", // Nested populate for attachments inside replyTo
                select: "url fileName filePath originalName", // Select specific fields from the attachments
              },
            },
          ],
        },
      ]);

    // if (!conversation) {
    // 	return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
    // 		status: HTTP_STATUS_CODE.NOT_FOUND,
    // 		data: {},
    // 		error: "Conversation not found",
    // 	});
    // }

    // const db = mongoose.connection.db;

    // const conversation = await db
    //   .collection("conversations")
    //   .aggregate([
    //     {
    //       $match: {
    //         $and: [
    //           { members: { $all: [userIdObject, idObject] } }, // Ensure IDs are in the array
    //           { $expr: { $eq: [{ $size: "$members" }, 2] } }, // Ensure array size matches exactly
    //         ],
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "messages", // Populate messages
    //         localField: "messages",
    //         foreignField: "_id",
    //         as: "messages",
    //       },
    //     },
    //     {
    //       $unwind: "$messages",
    //     },
    //     {
    //       $lookup: {
    //         from: "media", // Populate attachments for messages
    //         localField: "messages.attachments",
    //         foreignField: "_id",
    //         as: "messages.attachments",
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "messages", // Populate replyTo
    //         localField: "messages.replyTo",
    //         foreignField: "_id",
    //         as: "messages.replyTo",
    //       },
    //     },
    //     {
    //       $unwind: {
    //         path: "$messages.replyTo",
    //         preserveNullAndEmptyArrays: true,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "media", // Populate attachments in replyTo
    //         localField: "messages.replyTo.attachments",
    //         foreignField: "_id",
    //         as: "messages.replyTo.attachments",
    //       },
    //     },
    //     {
    //       $addFields: {
    //         "messages.replyTo": {
    //           $cond: {
    //             if: {
    //               $and: [
    //                 {
    //                   $eq: [{ $type: "$messages.replyTo.message" }, "missing"],
    //                 }, // Check if message is missing
    //                 { $eq: [{ $size: "$messages.replyTo.attachments" }, 0] }, // Check if attachments are empty
    //               ],
    //             },
    //             then: null, // Set replyTo to null
    //             else: {
    //               message: "$messages.replyTo.message", // Include message
    //               attachments: {
    //                 url: {
    //                   $arrayElemAt: ["$messages.replyTo.attachments.url", 0],
    //                 }, // Extract first element
    //                 fileName: {
    //                   $arrayElemAt: [
    //                     "$messages.replyTo.attachments.fileName",
    //                     0,
    //                   ],
    //                 },
    //                 filePath: {
    //                   $arrayElemAt: [
    //                     "$messages.replyTo.attachments.filePath",
    //                     0,
    //                   ],
    //                 },
    //                 originalName: {
    //                   $arrayElemAt: [
    //                     "$messages.replyTo.attachments.originalName",
    //                     0,
    //                   ],
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     {
    //       $project: {
    //         messages: {
    //           senderId: 1,
    //           receiverId: 1,
    //           message: 1,
    //           createdAt: 1,
    //           attachments: {
    //             url: 1,
    //             fileName: 1,
    //             filePath: 1,
    //             originalName: 1,
    //           },
    //           replyTo: 1, // Include replyTo with specific structure
    //         },
    //       },
    //     },
    //   ])
    //   .toArray();

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "get conversation",
      data: conversation?.messages || [],
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      data: {},
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.me._id;

    const message = await Message.findOne({
      _id: messageId,
      // senderId: userId,
      $or: [{ senderId: userId }],
      isDeleted: false,
    }).populate("attachments");

    if (!message) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        data: {},
        error: "Message not found",
      });
    }

    const mediaIds = [];
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        mediaIds.push(attachment._id);
        await storageCore(DRIVERS.STORAGE_ACTIONS.DELETE_FILE, {
          sourceFilePath: attachment.key,
          fileKey: [{ Key: attachment.key }],
        });
      }
      await Media.deleteMany({ _id: { $in: mediaIds } });
    }

    const conversation = await Conversation.findOne({
      members: { $all: [userId, message.receiverId], $size: 2 },
      isDeleted: false,
    });

    if (!conversation) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        data: {},
        error: "Conversation not found",
      });
    }

    const messageIndex = conversation.messages.indexOf(messageId);
    conversation.messages.splice(messageIndex, 1);
    conversation.save();

    await Message.deleteOne({
      _id: messageId,
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
    // await Message.updateOne(
    //   { _id: messageId },
    //   {
    //     $set: {
    //       isDeleted: true,
    //     },
    //   }
    // );
    //socket functionality
    const receiverSocketId = getReceiverSocketId(message?.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deleteMessage", messageId);
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "Message deleted successfully",
      data: {},
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      data: {},
      error: error.message,
    });
  }
};

export const clearChat = async (req, res) => {
  try {
    const userId = req.me._id;
    const { id } = req.params;

    const conversation = await Conversation.findOne({
      members: { $all: [userId, id], $size: 2 },
      isDeleted: false,
    }).populate([
      {
        path: "messages",
        select: "senderId receiverId message attachments createdAt",
        populate: [
          {
            path: "attachments",
            select: "key",
          },
        ],
      },
    ]);

    if (!conversation) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        data: {},
        error: "Conversation not found",
      });
    }

    const messageIds = [];
    const mediaIds = [];
    for (const message of conversation.messages) {
      messageIds.push(message._id);
      if (message.attachments && message.attachments.length > 0) {
        for (const attachment of message.attachments) {
          mediaIds.push(attachment._id);
          await storageCore(DRIVERS.STORAGE_ACTIONS.DELETE_FILE, {
            sourceFilePath: attachment.key,
            fileKey: [{ Key: attachment.key }],
          });
        }
      }
    }

    if (mediaIds && mediaIds.length > 0) {
      await Media.deleteMany({ _id: { $in: mediaIds } });
    }
    if (messageIds && messageIds.length > 0) {
      await Message.deleteMany({ _id: { $in: messageIds } });
    }

    // await Message.updateMany(
    //   { _id: { $in: conversation.messages } },
    //   {
    //     $set: {
    //       isDeleted: true,
    //     },
    //   }
    // );

    conversation.messages = [];
    await conversation.save();

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "Chat cleared successfully",
      data: {},
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      data: {},
      error: error.message,
    });
  }
};
