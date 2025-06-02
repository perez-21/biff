import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import { apiLimiter } from "./middleware/rate-limit.middleware";
import { SocketService } from "./services/socket.service";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO service
const socketService = new SocketService(server);

// Make socketService available to routes
app.set("socketService", socketService);

// Connect to MongoDB
connectDB();

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`
  );
});
