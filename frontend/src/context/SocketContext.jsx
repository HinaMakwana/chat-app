import { createContext, useEffect, useContext, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const authUser = useAuthContext();
	useEffect(() => {
		if (authUser) {
			const socket = io("https://chat-app-production-y4nv.onrender.com",{
				query: {
					userId: authUser?.authUser?.data?.findUser?._id
				}
			});

			setSocket(socket);

			socket.on("getOnlineUsers", (users) => {

				setOnlineUsers(users);
			});

			return () => socket.close();
			// socket.emit("addNewUser", authUser._id);
			// socket.on("getOnlineUsers", (res) => {
			// 	setOnlineUsers(res);
			// });
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);
  return (
    <SocketContext.Provider value={{ socket,onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
