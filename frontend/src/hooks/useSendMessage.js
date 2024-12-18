import useConversationStore from "../zustand/useConversation";

import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useState } from "react";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } =
    useConversationStore();
  const token = Cookies.get("token");

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/message/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ message, receiverId: selectedConversation._id }),
        }
      );
      const data = await res.json();
      setMessages([...messages, data.data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

	return { loading, sendMessage };
};

export default useSendMessage;
