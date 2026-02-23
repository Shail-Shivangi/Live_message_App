"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function UserList() {
  const users = useQuery(api.users.getUsers);
  const { user } = useUser();
  const [search, setSearch] = useState("");

  if (!users) return <p className="p-4">Loading...</p>;

  const filteredUsers = users
    .filter((u) => u.clerkId !== user?.id)
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Search users..."
        className="p-2 m-2 rounded bg-gray-100 focus:outline-none"
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          No users found
        </p>
      )}

      {filteredUsers.map((u) => (
        <div
          key={u._id}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
        >
          <img
            src={u.image}
            alt={u.name}
            className="w-8 h-8 rounded-full"
          />
          <span>{u.name}</span>
        </div>
      ))}
    </div>
  );
}