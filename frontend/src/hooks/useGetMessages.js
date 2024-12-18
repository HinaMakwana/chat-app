import React, { useEffect, useState } from "react";
import useConversationStore from "../zustand/useConversation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } =
    useConversationStore();
  const token = Cookies.get("token");
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/message/get/${selectedConversation?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

				if(selectedConversation?._id) { setMessages(data.data);}

      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [selectedConversation?._id, setMessages]);
  return { loading, messages };
};

export default useGetMessages;
