import rateLimit from "express-rate-limit";
import { Request } from "express";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again after 15 minutes",
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: "Too many requests from this IP, please try again after a minute",
});

export const messageLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 messages per day
  message:
    "You have reached your daily message limit. Please try again tomorrow.",
  skip: (req: Request) => {
    // Skip rate limiting if user is not on free subscription
    return req.user?.subscription !== "free";
  },
  keyGenerator: (req: Request) => {
    // Use both IP and userId to track limits per user
    return `${req.ip}-${req.user?.id}`;
  },
});

export const conversationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 conversations per minute
  message: "Too many conversations created",
});
