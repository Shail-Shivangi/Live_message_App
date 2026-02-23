"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";

export default function ChatPage() {
  const { user } = useUser();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (user) {
      createUser({
        clerkId: user.id,
        name: user.fullName || "Unknown",
        image: user.imageUrl,
      });
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}