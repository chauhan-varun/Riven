import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Called from the client after Clerk authentication to ensure
 * the user exists in the Convex `users` table.
 * Returns the Convex user `_id`.
 */
export const store = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called store without authentication present");
    }

    // Check if the user already exists by their Clerk ID (JWT subject)
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing !== null) {
      // Update name/email/image if they changed in Clerk
      if (
        (args.name !== undefined && existing.name !== args.name) ||
        (args.email !== undefined && existing.email !== args.email) ||
        (args.imageUrl !== undefined && existing.imageUrl !== args.imageUrl)
      ) {
        await ctx.db.patch(existing._id, {
          name: args.name ?? existing.name,
          email: args.email ?? existing.email,
          imageUrl: args.imageUrl ?? existing.imageUrl,
        });
      }
      return existing._id;
    }

    // Create a new user record
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: args.name ?? "",
      email: args.email ?? "",
      imageUrl: args.imageUrl,
    });
  },
});

/**
 * Get the current authenticated user's Convex record.
 */
export const current = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      clerkId: v.string(),
      name: v.string(),
      email: v.string(),
      imageUrl: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});
