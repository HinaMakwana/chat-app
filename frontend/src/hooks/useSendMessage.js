import useConversationStore from "../zustand/useConversation";

import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useState } from "react";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } =
    useConversationStore();
  const token = Cookies.get("token");

  const sendMessage = async ({ message, attachments, replyTo }) => {
    
    setLoading(true);
    try {
      const payload = {
        message,
        attachments: [],
        receiverId: selectedConversation._id,
        replyTo: replyTo ? replyTo._id : null,
      };

      if (attachments && attachments.length > 0) {
        const formData = new FormData();

        // Append each file to FormData
        attachments.forEach((attachment, index) => {
          if (attachment.file) {
            formData.append(`file`, attachment.file); // 'files' is the key expected by the backend
          }
        });

        const res = await fetch(`/api/file/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (data.errorCode === "AUTH003" || data.errorCode === "AUTH004") {
          localStorage.removeItem("chat-user");
          Cookies.remove("token");
        }
        if (data.data && data.data.length > 0) {
          for (let i of data.data) {
            payload.attachments.push({ mediaId: i._id });
          }
        }
      }

      const res = await fetch(`/api/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
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
