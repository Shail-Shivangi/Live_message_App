import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// convex/schema.ts
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    image: v.string(),
    online: v.optional(v.boolean()),    // Added v.optional
    lastSeen: v.optional(v.number()),   // Added v.optional
    updatedAt: v.optional(v.number()), // Added v.optional
  }).index("by_clerkId", ["clerkId"]),
 
  conversations: defineTable({
  members: v.array(v.id("users")),
  isGroup: v.boolean(),
  name: v.optional(v.string()),
  updatedAt: v.optional(v.number()),
}),

 messages: defineTable({
  conversationId: v.id("conversations"),
  senderId: v.id("users"),
  body: v.string(),
  createdAt: v.number(),
  deleted: v.boolean(),
  readBy: v.array(v.id("users")),
})
.index("by_conversation", ["conversationId"]),

typing: defineTable({
  userId: v.id("users"),
  conversationId: v.id("conversations"),
  updatedAt: v.optional(v.number()),
})
.index("by_user_conversation", ["userId", "conversationId"])
.index("by_conversation", ["conversationId","userId"]),
});


// npx convex dev --configure=new --once
