import React, { useEffect, useRef, useState } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import useConversationStore from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { IoSettings } from "react-icons/io5";
import { RiReplyFill } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";

function MessageContainer() {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const [replyMessage, setReplyMessage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

  useEffect(() => {
    // socket.on("newMessage", (newMessage) => {
    //   setMessages([...messages, newMessage]);
    // });

    return () => {
      // socket.off("newMessage");
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className=" md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">To: </span>
            <span className="text-gray-900 font-bold">
              {selectedConversation.username}
            </span>
            <IoSettings className="text-gray-900 float-right mt-1" onClick={()=> setMenuVisible(true)}/>
            {menuVisible && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10"
              >
                <div
                  onClick={() => {
                    setMenuVisible(false);
                  }}
                  className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100"
                >
                  <RiReplyFill className="inline mr-2" />
                  Reply
                </div>
                <div
                  onClick={() => {
                    setMenuVisible(false);
                  }}
                  className={`px-4 py-2 text-red-600 cursor-pointer hover:bg-gray-100`}
                >
                  <AiOutlineDelete className="inline mr-2" />
                  Delete
                </div>
              </div>
            )}
          </div>
          <Messages onReply={setReplyMessage} />
          <MessageInput
            replyMessage={replyMessage}
            clearReply={() => setReplyMessage(null)}
          />
        </>
      )}
    </div>
  );
}

export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center px-4 sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p className="text-2xl font-bold">
          Welcome 👋🏻 {authUser.data.findUser.firstName}!
        </p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
