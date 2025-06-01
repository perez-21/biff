import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();
const chatController = new ChatController();

router.use(auth);

router.post("/conversations", chatController.createConversation);
router.get("/conversations", chatController.getConversations);
router.get(
  "/conversations/:conversationId/messages",
  chatController.getMessages
);
router.post(
  "/conversations/:conversationId/messages",
  chatController.sendMessage
);
router.delete(
  "/conversations/:conversationId",
  chatController.deleteConversation
);

export default router;
