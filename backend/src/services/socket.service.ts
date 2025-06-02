import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

interface MessageData {
  conversationId: string;
  content: string;
  type: string;
}

interface SocketEventData {
  [key: string]: unknown;
}

export class SocketService {
  private io: SocketIOServer;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.use(this.authenticateSocket.bind(this));

    this.io.on("connection", (socket: AuthenticatedSocket) => {
      if (!socket.userId) return;

      // Add socket to user's socket list
      const userSockets = this.userSockets.get(socket.userId) || [];
      userSockets.push(socket.id);
      this.userSockets.set(socket.userId, userSockets);

      // Join user's personal room
      socket.join(`user:${socket.userId}`);

      // Handle joining conversation rooms
      socket.on("joinConversation", (conversationId: string) => {
        socket.join(`conversation:${conversationId}`);
      });

      // Handle leaving conversation rooms
      socket.on("leaveConversation", (conversationId: string) => {
        socket.leave(`conversation:${conversationId}`);
      });

      // Handle new messages
      socket.on("sendMessage", async (data: MessageData) => {
        // Emit to all users in the conversation
        this.io.to(`conversation:${data.conversationId}`).emit("newMessage", {
          ...data,
          senderId: socket.userId,
          timestamp: new Date(),
        });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        if (socket.userId) {
          const userSockets = this.userSockets.get(socket.userId) || [];
          const updatedSockets = userSockets.filter((id) => id !== socket.id);
          if (updatedSockets.length === 0) {
            this.userSockets.delete(socket.userId);
          } else {
            this.userSockets.set(socket.userId, updatedSockets);
          }
        }
      });
    });
  }

  private async authenticateSocket(
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
  ) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  }

  // Method to send message to specific user
  public sendToUser(userId: string, event: string, data: SocketEventData) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Method to send message to specific conversation
  public sendToConversation(
    conversationId: string,
    event: string,
    data: SocketEventData
  ) {
    this.io.to(`conversation:${conversationId}`).emit(event, data);
  }
}
