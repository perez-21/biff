import mongoose, { Document, Schema } from "mongoose";
import { IMessage, Message } from "./message.model";

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  aiModel: "gpt-4" | "gpt-3.5-turbo" | "claude-3-sonnet" | "claude-3-haiku";
  metadata: {
    totalTokens: number;
    messageCount: number;
    lastActivity: number;
  };
  isArchived: boolean;
  lastMessageAt: number;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "New Conversation",
    },
    messages: [Message],
    aiModel: {
      type: String,
      enum: ["gpt-4", "gpt-3.5-turbo", "claude-3-sonnet", "claude-3-haiku"],
      default: "gpt-3.5-turbo",
    },
    metadata: {
      totalTokens: {
        type: Number,
        default: 0, // Total tokens used in the conversation
      },
      messageCount: {
        type: Number,
        default: 0,
      },
      lastActivity: {
        type: Number,
        default: Date.now,
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    lastMessageAt: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update metadata before saving
conversationSchema.pre("save", function (next) {
  this.metadata.messageCount = this.messages.length;
  this.metadata.totalTokens = this.messages.reduce(
    (sum, msg) => sum + (msg.tokenCount || 0),
    0
  );
  this.metadata.lastActivity = new Date().getTime();

  // Auto-generate title from first user message if still default
  if (this.title === "New Chat" && this.messages.length > 0) {
    const firstUserMessage = this.messages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      this.title =
        firstUserMessage.content.slice(0, 50) +
        (firstUserMessage.content.length > 50 ? "..." : "");
    }
  }

  next();
});

// Index for faster queries
conversationSchema.index({ userId: 1, lastMessageAt: -1 });
conversationSchema.index({ userId: 1, "metadata.lastActivity": -1 });

// Virtual for formatted last activity
conversationSchema.virtual("formattedLastActivity").get(function () {
  const now = new Date().getTime();
  const lastActivity = this.metadata.lastActivity;
  const diffInMinutes = Math.floor((now - lastActivity) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Date(lastActivity).toLocaleDateString();
});

// Method to add a message
conversationSchema.methods.addMessage = function (
  role,
  content,
  model = null,
  tokenCount = 0
) {
  this.messages.push({
    role,
    content,
    model,
    tokenCount,
    timestamp: new Date(),
  });

  return this.save();
};

// Method to get recent chats for a user
conversationSchema.statics.getRecentChats = function (userId, limit = 20) {
  return this.find({
    userId,
    isArchived: false,
  })
    .sort({ "metadata.lastActivity": -1 })
    .limit(limit)
    .select("title metadata createdAt updatedAt")
    .lean();
};

// Method to search chats
conversationSchema.statics.searchChats = function (userId, query, limit = 10) {
  return this.find({
    userId,
    isArchived: false,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { "messages.content": { $regex: query, $options: "i" } },
    ],
  })
    .sort({ "metadata.lastActivity": -1 })
    .limit(limit)
    .select("title metadata createdAt updatedAt")
    .lean();
};

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
