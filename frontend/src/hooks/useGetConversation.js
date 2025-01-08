import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const useGetConversation = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getConversation = async () => {
      console.log("Fetching conversation started...");
      setLoading(true);
      const token = Cookies.get("token");

      try {
        const res = await fetch(`/api/user`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.errorCode === "AUTH003" || data.errorCode === "AUTH004") {
          localStorage.removeItem("chat-user");
          Cookies.remove("token");
        } else {
          setConversation(data.data);
        }
      } catch (error) {
        toast.error(`Failed to fetch: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getConversation();
  }, []); 

  return { loading, conversations };
};

export default useGetConversation;
