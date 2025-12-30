/**
 * Request Logging Middleware
 * Logs all incoming requests with unique IDs for tracing
 */

import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Generates a unique request ID for tracing
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `req_${timestamp}_${random}`;
}

/**
 * Request logging middleware
 * Logs request start, end, duration, and status code
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = generateRequestId();
  const start = Date.now();

  // Attach request ID to request object for tracing
  req.requestId = requestId;

  // Log incoming request
  console.log(`[${requestId}] → ${req.method} ${req.path}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusEmoji = res.statusCode < 400 ? '✅' : '❌';
    console.log(`[${requestId}] ${statusEmoji} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
