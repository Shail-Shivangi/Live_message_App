import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    image: v.string(),
    online: v.boolean(),     // Add this
    lastSeen: v.number(),    // Add this
    updatedAt: v.number(),   // Add this
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("users", {
        ...args, // Now 'args' includes all the fields
      });
    }
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const setOnline = mutation({
  args: {
    userId: v.id("users"),
    online: v.boolean(), // ✅ MUST EXIST
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      online: args.online,
      lastSeen: args.online ? undefined : Date.now(),
    });
  },
});

export const setOffline = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      online: false,
      lastSeen: Date.now(),
    });
  },
});