import React from "react";
import useGetMessages from "../../hooks/useGetMessages";
import { useAuthContext } from "../../context/AuthContext";
import useConversationStore from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

function Message({message}) {

  const {authUser} = useAuthContext();
  const {selectedConversation} = useConversationStore();

  const fromMe = message.senderId === authUser.data.findUser._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? authUser.data.findUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const formattedTime = extractTime(message.createdAt);
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div>
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={profilePic}
            />
          </div>
        </div>
        {/* <div className="chat-header">
          <time className="text-xs opacity-50">12:45</time>
        </div> */}
        <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}`}>{message.message}</div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
      </div>
    </div>
  );
}

export default Message;
