import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from "./routes/chat.routes";
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { validateEnv } from './config/env';

// Load environment variables
dotenv.config();

// Validate environment variables (fail fast if misconfigured)
const config = validateEnv();

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Log all requests

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Spur AI Chat Backend is running' });
});

// Routes
app.use('/api/chat', chatRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});