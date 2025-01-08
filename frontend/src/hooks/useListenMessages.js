import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversationStore from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversationStore();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });

    // socket?.on("deleteMessage",(deletedMessage)=> {
    // 	console.log(deletedMessage,'deletedMessage');
    // 	setMessages(messages.filter(message=>message._id !== deletedMessage))
    // })
    socket?.on("deleteMessage", (deletedMessage) => {
			console.log(deletedMessage,'deletedMessage');
      setMessages(messages.filter(message=>message._id !== deletedMessage)
      );
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("deleteMessage");
    };
  }, [socket, setMessages, messages]);
};

export default useListenMessages;
