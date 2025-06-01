import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { auth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createConversationValidation,
  sendMessageValidation,
} from "../validations/chat.validation";
import {
  apiLimiter,
  messageLimiter,
} from "../middleware/rate-limit.middleware";

const router = Router();
const chatController = new ChatController();

router.use(auth);

/**
 * @swagger
 * /api/chat/conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/conversations",
  apiLimiter,
  validate(createConversationValidation),
  chatController.createConversation
);

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Get all conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 */
router.get("/conversations", apiLimiter, chatController.getConversations);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *       404:
 *         description: Conversation not found
 */
router.get(
  "/conversations/:conversationId/messages",
  apiLimiter,
  chatController.getMessages
);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - role
 *             properties:
 *               content:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, assistant]
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       404:
 *         description: Conversation not found
 */
router.post(
  "/conversations/:conversationId/messages",
  messageLimiter,
  validate(sendMessageValidation),
  chatController.sendMessage
);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}:
 *   delete:
 *     summary: Delete a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       404:
 *         description: Conversation not found
 */
router.delete(
  "/conversations/:conversationId",
  apiLimiter,
  chatController.deleteConversation
);

export default router;
