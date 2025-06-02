import { Request, Response } from "express";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import Joi from "joi";

export class ChatController {
  constructor() {
    this.createConversationSchema = Joi.object({
      title: Joi.string().max(100).optional(),
      aiModel: Joi.string().valid("gpt-3.5-turbo", "gpt-4").optional(),
    });
    this.sendMessageSchema = Joi.object({
      content: Joi.string().required(),
      role: Joi.string().valid("user", "assistant").required(),
    });
  }

  createConversationSchema: Joi.ObjectSchema;

  sendMessageSchema: Joi.ObjectSchema;

  async createConversation(req: Request, res: Response, auth) {
    try {
      const { error, value } = this.createConversationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { title = "New Chat", model = "gpt-3.5-turbo" } = value;
      const userId = req.user.userId;

      const conversation = new Conversation({
        userId,
        title,
        model,
        messages: [],
      });

      await conversation.save();

      res.status(201).json({
        success: true,
        message: "conversation created successfully",
        conversation: {
          id: conversation._id,
          title: conversation.title,
          model: conversation.model,
          createdAt: conversation.createdAt,
          metadata: conversation.metadata,
        },
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({
        success: false,
      });
    }
  }

  async getConversations(req: Request, res: Response) {
    try {
      const userId = req.user._id;

      const conversations = await Conversation.find({ userId })
        .sort({ lastMessageAt: -1 })
        .limit(50);

      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversations" });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      // Verify conversation ownership
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
        isArchived: false,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .limit(100);

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const { content, role } = req.body;
      const userId = req.user._id;

      // Verify conversation ownership
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Create message
      const message = await Message.create({
        conversationId,
        content,
        role,
      });

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  }

  async deleteConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      // Verify conversation ownership
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Delete conversation and its messages
      await Promise.all([
        Conversation.findByIdAndDelete(conversationId),
        Message.deleteMany({ conversationId }),
      ]);

      res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting conversation" });
    }
  }
}
