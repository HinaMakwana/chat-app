import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import  Cookies  from 'js-cookie';
import useLogout from "./useLogout";
import { useNavigate } from "react-router-dom";

const useGetConversation = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversation] = useState([]);
	const navigate = useNavigate()

  useEffect(() => {
    const getConversation = async () => {
      console.log("Fetching conversation started...");
      setLoading(true);
			const token = Cookies.get('token');

      try {

        const res = await fetch(`/api/user`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await res.json();

        setConversation(data.data);

      } catch (error) {
        toast.error(`Failed to fetch: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getConversation();
  }, []); // Empty dependency array to ensure it runs once on mount

  return { loading, conversations };
};

export default useGetConversation;
