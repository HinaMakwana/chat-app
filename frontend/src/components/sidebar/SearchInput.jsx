import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import useConversationStore from "../../zustand/useConversation";
import useGetConversation from "../../hooks/useGetConversation";
import toast from "react-hot-toast";

function SearchInput() {
	const [search,setSearch] = useState('')
	const {setSelectedConversation} = useConversationStore();
	const {conversations} = useGetConversation();

	const handleSubmit = (e) => {
		e.preventDefault();
		if(!search) return;
		const conversation = conversations.find((c) => c.username.toLowerCase().includes(search.toLowerCase()));

		if (conversation) {
			setSelectedConversation(conversation);
			setSearch('');
		} else {
			toast.error('No such user found!');
		}
	}
  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="input input-bordered rounded-full"
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <IoSearch className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
}

export default SearchInput;
