import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';

const useLogout = () => {
	const [loading,setLoading] = useState(false);

	const {setAuthUser} = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			localStorage.removeItem("chat-user");
			Cookies.remove("token");
			setAuthUser(null);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}
	return {loading,logout};
}

export default useLogout