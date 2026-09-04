import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  // ── Users (synced from Clerk on first login) ──────────────────────────
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  // ── Subscriptions ───────────────────────────────────────────────────────
  subscriptions: defineTable({
    userId: v.id('users'),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    productId: v.optional(v.string()),
    priceId: v.optional(v.string()),
    planCode: v.optional(v.string()),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    cancelAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    seats: v.optional(v.number()),
    metadata: v.optional(v.any()),
    creditsBalance: v.number(),
    creditsGrantPerPeriod: v.number(),
    creditsRolloverLimit: v.number(),
    lastGrantCursor: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_polarSubscriptionId', ['polarSubscriptionId'])
    .index('by_status', ['status']),

  // ── Credits Ledger ──────────────────────────────────────────────────────
  credits_ledger: defineTable({
    userId: v.id('users'),
    subscriptionId: v.id('subscriptions'),
    amount: v.number(),
    type: v.string(), // "grant" | "consume" | "adjust"
    reason: v.optional(v.string()),
    idempotencyKey: v.optional(v.string()),
    meta: v.optional(v.any()),
  })
    .index('by_subscriptionId', ['subscriptionId'])
    .index('by_userId', ['userId'])
    .index('by_idempotencyKey', ['idempotencyKey']),

  // ── Projects ──────────────────────────────────────────────────────────
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    styleGuide: v.optional(v.string()),
    sketchesData: v.any(), // JSON structure matching Redux shapes state
    viewportData: v.optional(v.any()), // JSON structure for viewport state
    generatedDesignData: v.optional(v.any()), // JSON structure for generated UI components
    thumbnail: v.optional(v.id("_storage")), // Storage ID for project thumbnail
    moodBoardImages: v.optional(v.array(v.id("_storage"))), // Array of storage IDs for mood boards
    inspirationImages: v.optional(v.array(v.id("_storage"))), // Array of storage IDs for inspiration images
    lastModified: v.number(), // Timestamp for last modification
    createdAt: v.number(), // Project creation timestamp
    isPublic: v.optional(v.boolean()), // For future sharing features
    tags: v.optional(v.array(v.string())), // For future categorization
    projectNumber: v.number(), // Auto-incrementing project number per user
  })
    .index("by_userId", ["userId"]),

  // ── Project counters (sequential project numbering per user) ──────────
  project_counters: defineTable({
    userId: v.id("users"),
    nextProjectNumber: v.number(), // Next available project number for this user
  })
    .index("by_userId", ["userId"]),
});

export default schema;
