import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  content: string;
  role: "user" | "assistant";
  aiModel: "gpt-4" | "gpt-3.5-turbo" | "claude-3-sonnet" | "claude-3-haiku";
  createdAt: Date;
  tokenCount: number; // Placeholder for token count
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000, // Limit message length to 5000 characters
    },
    aiModel: {
      type: String,
      enum: ["gpt-4", "gpt-3.5-turbo", "claude-3-sonnet", "claude-3-haiku"],
      required: function () {
        return this.role === "assistant"; // Only required for assistant messages
      },
    },
    tokenCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
