import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      error: errorDetails[0]?.message || 'Validation failed',
      details: errorDetails,
    });
  }

  // Handle other known application errors
  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error('[BuildSync API] Server error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: `Endpoint not found - ${req.method} ${req.originalUrl}`,
  });
}
