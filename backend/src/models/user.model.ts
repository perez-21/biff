import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  subscription: {
    type: "free" | "premium";
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    status: "active" | "inactive" | "canceled" | "past_due";
  };
  usage: {
    dailyPrompts: number;
    lastResetDate: Date;
    totalPrompts: number;
  };
  preferences: {
    defaultModel:
      | "gpt-4"
      | "gpt-3.5-turbo"
      | "claude-3-sonnet"
      | "claude-3-haiku";
    theme: "light" | "dark" | "system";
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      trim: true,
    },
    subscription: {
      type: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      status: {
        type: String,
        enum: ["active", "inactive", "canceled", "past_due"],
        default: "inactive",
      },
    },
    usage: {
      dailyPrompts: {
        type: Number,
        default: 0,
      },
      lastResetDate: {
        type: Date,
        default: Date.now,
      },
      totalPrompts: {
        type: Number,
        default: 0,
      },
    },
    preferences: {
      defaultModel: {
        type: String,
        enum: ["gpt-4", "gpt-3.5-turbo", "claude-3-sonnet", "claude-3-haiku"],
        default: "gpt-3.5-turbo",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user can make a prompt (rate limiting)
userSchema.methods.canMakePrompt = function (): boolean {
  const now = new Date();
  const resetDate = new Date(this.usage.lastResetDate);

  // Reset daily count if it's a new day
  if (now.toDateString() !== resetDate.toDateString()) {
    this.usage.dailyPrompts = 0;
    this.usage.lastResetDate = now;
  }

  // Premium users have unlimited prompts
  if (
    this.subscription.type === "premium" &&
    this.subscription.status === "active"
  ) {
    return true;
  }

  // Free users limited to 10 prompts per day
  return this.usage.dailyPrompts < 10;
};

// Increment prompt count
userSchema.methods.incrementPromptCount = function (): void {
  this.usage.dailyPrompts += 1;
  this.usage.totalPrompts += 1;
};

// Get remaining prompts for free users
userSchema.methods.getRemainingPrompts = function (): number | string {
  if (
    this.subscription.type === "premium" &&
    this.subscription.status === "active"
  ) {
    return "unlimited";
  }

  const now = new Date();
  const resetDate = new Date(this.usage.lastResetDate);

  // Reset if new day
  if (now.toDateString() !== resetDate.toDateString()) {
    return 10;
  }

  return Math.max(0, 10 - this.usage.dailyPrompts);
};

export const User = mongoose.model<IUser>("User", userSchema);
