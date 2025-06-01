import { Request, Response } from "express";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";

export class ChatController {
  async createConversation(req: Request, res: Response) {
    try {
      const { title } = req.body;
      const userId = req.user._id;

      const conversation = await Conversation.create({
        userId,
        title,
      });

      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Error creating conversation" });
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
