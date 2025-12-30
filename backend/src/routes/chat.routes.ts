import { Router, Request, Response, NextFunction } from 'express';
import { handleChatMessage, getConversationHistory } from '../services/chat.service';

const router = Router();

// POST /api/chat/message - Send a message and get AI reply
router.post('/message', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
      res.status(400);
      throw new Error('Message is required and must be a string');
    }

    if (message.trim().length === 0) {
      res.status(400);
      throw new Error('Message cannot be empty');
    }

    // Limit message length to prevent abuse
    if (message.length > 1000) {
      res.status(400);
      throw new Error('Message is too long (max 1000 characters)');
    }

    // Validate sessionId if provided
    if (sessionId && typeof sessionId !== 'string') {
      res.status(400);
      throw new Error('SessionId must be a string');
    }

    // Process the message
    const response = await handleChatMessage({
      message: message.trim(),
      sessionId,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/chat/history/:sessionId - Get conversation history
router.get('/history/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400);
      throw new Error('SessionId is required');
    }

    const messages = await getConversationHistory(sessionId);

    res.json({
      sessionId,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

export default router;