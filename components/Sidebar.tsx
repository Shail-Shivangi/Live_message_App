"use client";

import { useState } from "react";
import ConversationList from "./ConversationList";
import UserList from "./UserList";

interface Props {
  selectedConversation: string | null;
  setSelectedConversation: (id: string | null) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}

export default function Sidebar({
  selectedConversation,
  setSelectedConversation,
  selectedUserId,
  setSelectedUserId,
}: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="w-80 border-r h-screen flex flex-col bg-white">
      {/* 🔍 SEARCH BAR */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search users to start a chat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* If searching, only show UserList results */}
        {search ? (
          <div className="mt-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Search Results
            </p>
            <UserList
              search={search}
              selectedUserId={selectedUserId}
              setSelectedConversation={(id: string) => {
                setSelectedConversation(id);
                setSearch(""); // Clear search after selecting a user
              }}
              setSelectedUserId={setSelectedUserId}
            />
          </div>
        ) : (
          /* If not searching, show existing conversations */
          <>
            <p className="px-4 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Your Chats
            </p>
            <ConversationList
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
            />
          </>
        )}
      </div>
    </div>
  );
}