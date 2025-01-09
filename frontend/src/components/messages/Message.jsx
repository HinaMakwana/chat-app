import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversationStore from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";
import { RiReplyFill } from "react-icons/ri";
import {
  AiOutlineDelete,
  AiOutlineEllipsis,
  AiOutlineClose,
} from "react-icons/ai";
import useDeleteMessage from "../../hooks/useDeleteMessage";
import useListenMessages from "../../hooks/useListenMessages";

function Message({ message, onReply }) {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversationStore();
  const { loading, deleteMessage } = useDeleteMessage();
  useListenMessages();

  const fromMe = message.senderId === authUser.data.findUser._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.data.findUser.profilePic
    : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-teal-950" : "bg-gray-800";
  const formattedTime = extractTime(message.createdAt);
  const [isHovered, setIsHovered] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const messageRef = useRef(null);

  const deleteMsg = async (msgId) => {
    await deleteMessage(msgId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Render attachments
  const renderAttachments = (attachments) =>
    attachments?.map((attachment, index) => {
      const isImage = /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(attachment.url);
      const isPDF = /\.pdf$/i.test(attachment.url);
      const isVideo = /\.(mp4|mov|avi|mkv|flv|wmv)$/i.test(attachment.url);
      const fileName = attachment.originalName || "Unknown File";

      return (
        <div key={index} className="relative group">
          {isImage && (
            <img
              src={attachment.url}
              alt="attachment"
              className="w-20 h-20 object-cover rounded-md"
            />
          )}
          {isPDF && (
            <div
              className="p-2 bg-gray-200 rounded-md text-black flex items-center gap-2 cursor-pointer"
              onClick={() => window.open(attachment.url, "_blank")}
            >
              <span>{fileName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12.75H4.5m15 0l-6 6m6-6l-6-6"
                />
              </svg>
            </div>
          )}
          {isVideo && (
            <video
              src={attachment.url}
              className="w-20 h-20 object-cover rounded-md"
              controls
            />
          )}
          {!isImage && !isPDF && !isVideo && (
            <div
              className="p-2 bg-gray-200 rounded-md text-black flex items-center gap-2 cursor-pointer"
              onClick={() => window.open(attachment.url, "_blank")}
            >
              <span>{fileName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25m0 0L19.5 9m-3.75-3.75L11.25 9m8.25 3v5.25M15.75 18.75V15M15.75 15h-6m0 0l4.5 3.75m-4.5-3.75l4.5-3.75"
                />
              </svg>
            </div>
          )}
        </div>
      );
    });

  return (
    <div
      ref={messageRef}
      className={`chat ${chatClassName} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Profile" src={profilePic} />
        </div>
      </div>
      <div
        className={` chat-bubble chat-bubble-accent p-2 rounded-lg ${bubbleBgColor} text-white relative shadow-sm ${
          isHovered ? "shadow-md" : ""
        }`}
      >
        {/* ReplyTo Message */}
        {message.replyTo && (
          <div className="relative bg-slate-100 text-black rounded-md flex mb-1">
            {/* Purple Line on the Left */}
            <div className="w-1 bg-purple-600 rounded-l-md"></div>

            {/* Reply Message Content */}
            <div className="p-2 pl-2">
              {message.replyTo.message && (
                <div className="text-sm text-gray-700">
                  {message.replyTo.message}
                </div>
              )}

              {/* Reply Attachments */}
              {message.replyTo.attachments?.length > 0 &&
                renderAttachments(message.replyTo.attachments)}
            </div>
          </div>
        )}

        {/* Current Message */}
        {message.attachments?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {renderAttachments(message.attachments)}
            {isHovered && (
              <AiOutlineEllipsis
                onClick={() => setMenuVisible((prev) => !prev)}
                className="absolute top-0 right-0 mt-1 mr-1 text-gray-600 cursor-pointer"
              />
            )}
          </div>
        ) : (
          <div>{message.message}</div>
        )}

        {/* Menu Icon */}
        {isHovered && (
          <AiOutlineEllipsis
            onClick={() => setMenuVisible((prev) => !prev)}
            className="absolute top-1 right-1 text-gray-600 cursor-pointer"
          />
        )}
      </div>

      {/* Three-dot menu */}
      {menuVisible && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg"
        >
          <div
            onClick={() => {
              setMenuVisible(false);
              onReply(message);
            }}
            className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100"
          >
            <RiReplyFill className="inline mr-2" />
            Reply
          </div>
          <div
            onClick={() => {
              setMenuVisible(false);
              deleteMsg(message._id);
            }}
            className={`px-4 py-2 text-red-600 cursor-pointer hover:bg-gray-100 ${
              fromMe ? "" : "hidden"
            }`}
          >
            <AiOutlineDelete className="inline mr-2" />
            Delete
          </div>
        </div>
      )}

      {/* Time Footer */}
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
}

export default Message;
