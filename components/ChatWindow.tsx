"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { formatMessageTime } from "../lib/formatTime";

export default function ChatWindow({ conversationId }: any) {
  /* ================= ALL HOOKS FIRST ================= */
  const { user } = useUser();
  const users = useQuery(api.users.getUsers);
  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId } : "skip"
  );
  const typingUsers = useQuery(
    api.typing.getTypingUsers,
    conversationId ? { conversationId } : "skip"
  );

  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markAsRead);
  const startTyping = useMutation(api.typing.startTyping);
  const stopTyping = useMutation(api.typing.stopTyping);

  const [message, setMessage] = useState("");
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ================= DERIVED VALUES ================= */
  const currentUser = users?.find((u) => u.clerkId === user?.id);

  const otherTypingUser = typingUsers?.find(
    (t) => String(t.userId) !== String(currentUser?._id)
  );

  const typingUserData =
    otherTypingUser &&
    users?.find((u) => String(u._id) === String(otherTypingUser.userId));

  /* ================= SCROLL & UNREAD LOGIC ================= */
  useEffect(() => {
    if (!messages || !currentUser || !conversationId) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    const isMine = lastMessage.senderId === currentUser._id;

    // Use requestAnimationFrame to ensure the DOM has rendered the new message
    requestAnimationFrame(() => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      
      // threshold of 150px to determine if we are "at the bottom"
      const isNearBottom = distanceFromBottom < 150;

      if (isMine || isNearBottom) {
        // If I sent it OR I'm already looking at the bottom, scroll down automatically
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowNewMessageButton(false);
        markAsRead({ conversationId, userId: currentUser._id });
      } else {
        // Someone else sent a message and I'm scrolled up
        setShowNewMessageButton(true);
      }
    });
  }, [messages, conversationId, currentUser?._id, markAsRead]);

  /* ================= MANUAL SCROLL LISTENER ================= */
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      
      // If user manually scrolls to bottom, hide the button and clear unread
      if (distanceFromBottom < 20) {
        setShowNewMessageButton(false);
        if (conversationId && currentUser) {
          markAsRead({ conversationId, userId: currentUser._id });
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [conversationId, currentUser, markAsRead]);

  /* ================= TYPING CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  /* ================= HANDLERS ================= */
  const handleSend = async () => {
    if (!conversationId || !currentUser || !message.trim()) return;

    const body = message.trim();
    setMessage(""); 

    await sendMessage({
      conversationId,
      senderId: currentUser._id,
      body,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    stopTyping({ conversationId, userId: currentUser._id });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!conversationId || !currentUser) return;

    if (!typingTimeoutRef.current) {
      startTyping({ conversationId, userId: currentUser._id });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping({ conversationId, userId: currentUser._id });
      typingTimeoutRef.current = null;
    }, 5000);
  };

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessageButton(false);
    if (conversationId && currentUser) {
      markAsRead({ conversationId, userId: currentUser._id });
    }
  };

  /* ================= RENDER ================= */
  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex flex-col h-full bg-white">
      {/* ========== MESSAGE AREA ========== */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages?.map((msg) => {
          const isMine = msg.senderId === currentUser?._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] break-words shadow-sm ${
                  isMine
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.body}</p>
                <div className={`text-[10px] mt-1 opacity-60 text-right ${isMine ? "text-blue-100" : "text-gray-500"}`}>
                  {formatMessageTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* ========== TYPING INDICATOR ========== */}
      <div className="h-6 px-4 bg-white">
        {typingUserData && (
          <div className="text-xs text-gray-400 italic flex items-center gap-1">
            <span>{typingUserData.name} is typing</span>
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </div>
        )}
      </div>

      {/* ========== NEW MESSAGE BUTTON ========== */}
      {showNewMessageButton && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-10">
          <button
            onClick={handleScrollToBottom}
            className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-2"
          >
            <span className="text-lg">↓</span> New Messages
          </button>
        </div>
      )}

      {/* ========== INPUT ========== */}
      <div className="p-4 flex gap-2 border-t bg-white items-center">
        <input
          className="flex-1 bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          placeholder="Type your message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
        > send
          
        </button>
      </div>
    </div>
  );
}