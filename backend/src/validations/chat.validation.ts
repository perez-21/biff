import { body, param } from "express-validator";

export const createConversationValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
];

export const sendMessageValidation = [
  param("conversationId").isMongoId().withMessage("Invalid conversation ID"),
  body("content").trim().notEmpty().withMessage("Message content is required"),
  body("role").isIn(["user", "assistant"]).withMessage("Invalid message role"),
];
