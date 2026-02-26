"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function UserList({
  search, // Added search prop
  setSelectedConversation,
  selectedUserId,
  setSelectedUserId,
}: any) {
  const users = useQuery(api.users.getUsers);
  const { user } = useUser();
  const createConversation = useMutation(
    api.conversations.createOrGetConversation
  );

  if (!users) {
    return (
      <div className="p-4 text-gray-400">
        Loading users...
      </div>
    );
  }

  const currentUser = users.find(
    (u) => u.clerkId === user?.id
  );

  if (!currentUser) {
    return (
      <div className="p-4 text-gray-400">
        Loading user...
      </div>
    );
  }

  // Filter by search term and exclude current user
  const others = users.filter(
    (u) => 
      u.clerkId !== user?.id &&
      u.name.toLowerCase().includes(search?.toLowerCase() || "")
  );

  return (
    <div>
      {others.map((u) => (
        <div
          key={u._id}
          className={`flex items-center gap-3 p-3 cursor-pointer transition ${
            selectedUserId === u._id
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          }`}
          onClick={async () => {
            const convoId = await createConversation({
              user1: currentUser._id,
              user2: u._id,
            });

            setSelectedConversation(convoId);
            setSelectedUserId(u._id);
          }}
        >
          <div className="relative">
            <img
              src={u.image}
              className="w-10 h-10 rounded-full object-cover"
              alt={u.name}
            />
            {u.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-gray-400">
              {u.online
                ? "Online"
                : u.lastSeen
                ? `Last seen ${new Date(u.lastSeen).toLocaleTimeString()}`
                : "Offline"}
            </p>
          </div>
        </div>
      ))}
      {others.length === 0 && search && (
        <div className="p-4 text-center text-gray-400 text-sm">
          No users found matching "{search}"
        </div>
      )}
    </div>
  );
}