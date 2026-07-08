import { Request, Response, NextFunction } from 'express';

// 💡 What is this file?
// This is the global error handler middleware. 
// Whenever an error is thrown in our application, Express will pass it here.
// Analogy: Like a customer service desk that handles all complaints in a store,
// so individual departments don't have to figure out how to respond.

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send a standardized error response back to the client
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // We only send the stack trace in development mode for debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
