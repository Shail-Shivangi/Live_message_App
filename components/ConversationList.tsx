"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function ConversationList({
  selectedConversation,
  setSelectedConversation,
}: any) {
  const { user } = useUser();
  const users = useQuery(api.users.getUsers);

  const currentUser = users?.find(
    (u) => u.clerkId === user?.id
  );

  const conversations = useQuery(
    api.conversations.getUserConversations,
    currentUser ? { userId: currentUser._id } : "skip"
  );

  if (!users || !conversations || !currentUser) {
    return <div className="p-4 text-gray-400">Loading chats...</div>;
  }

  return (
    <div>
      {conversations.map((convo) => {
        const otherUserId = convo.members.find(
          (id: string) => id !== currentUser._id
        );

        const otherUser = users.find(
          (u) => u._id === otherUserId
        );

        if (!otherUser) return null;

        return (
          <div
            key={convo._id}
            onClick={() => setSelectedConversation(convo._id)}
            className={`flex items-center justify-between p-3 cursor-pointer transition ${
              selectedConversation === convo._id
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={otherUser.image}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={otherUser.name}
                />
                {otherUser.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div>
                <p className="font-medium">{otherUser.name}</p>
              </div>
            </div>

            {convo.unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {convo.unreadCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}