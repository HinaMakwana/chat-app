import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import useConversationStore from "../zustand/useConversation";

const useDeleteMessage = () => {
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const { messages, setMessages, selectedConversation } =
    useConversationStore();

  const deleteMessage = async (messageId) => {

    setLoading(true);
    try {
      const res = await fetch(
        `/api/message/delete/${messageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.errorCode === "AUTH003" || data.errorCode === "AUTH004") {
        localStorage.removeItem("chat-user");
        Cookies.remove("token");
      } else if(data.status === 200) {
        setMessages(messages.filter((message) => message._id !== messageId));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, deleteMessage };

};

export default useDeleteMessage;
