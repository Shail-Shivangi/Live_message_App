"use client";

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white border-b font-semibold">
        Select a conversation
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="text-gray-400 text-center mt-10">
          No messages yet
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}