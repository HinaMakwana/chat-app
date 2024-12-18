import React, { useEffect } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import useConversationStore from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

function MessageContainer() {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  useEffect(() => {
    // socket.on("newMessage", (newMessage) => {
    //   setMessages([...messages, newMessage]);
    // });

    return () => {
      // socket.off("newMessage");
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);
  return (
    <div className=" md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">To: </span>
            <span className="text-gray-900 font-bold">{selectedConversation.username}</span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
}

export default MessageContainer;

const NoChatSelected = () => {
  const {authUser} = useAuthContext()
  console.log(authUser  ,'ffff');
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center px-4 sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p className="text-2xl font-bold">Welcome 👋🏻 {authUser.data.findUser.firstName}!</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
