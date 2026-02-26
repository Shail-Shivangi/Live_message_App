"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  const { user } = useUser();
  const users = useQuery(api.users.getUsers);
  const createUser = useMutation(api.users.createUser);
  const setOnline = useMutation(api.presence.setOnline);
  const setOffline = useMutation(api.presence.setOffline);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const currentUser = users?.find((u) => u.clerkId === user?.id);

  // ✅ Fix 1: Ensure all required fields (like image) are passed
  useEffect(() => {
  if (!user || !users) return;
  const existingUser = users.find((u) => u.clerkId === user.id);

  if (!existingUser) {
    createUser({
      clerkId: user.id,
      name: user.fullName || "Unknown",
      image: user.imageUrl,
      online: true,           // Add this
      lastSeen: Date.now(),   // Add this
      updatedAt: Date.now(),  // Add this
    });
  }
}, [user, users, createUser]);

  // ✅ Fix 2: Consistent Presence Logic
  useEffect(() => {
    if (!currentUser) return;

    // Fixed: Match backend validator (ensure 'online' is passed if required)
    setOnline({ 
      userId: currentUser._id, 
      online: true 
    });

    const handleBeforeUnload = () => {
      setOffline({ userId: currentUser._id });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Ensure user is marked offline on component unmount
      setOffline({ userId: currentUser._id });
    };
  }, [currentUser?._id, setOnline, setOffline]);

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
      <ChatWindow conversationId={selectedConversation} />
    </div>
  );
}