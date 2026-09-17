import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET) {
  console.warn('[BuildSync Auth] WARNING: JWT_SECRET is not defined in environment variables. Authentication will fail if not configured.');
}

export function signToken(payload) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required to sign authentication tokens.');
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required to verify authentication tokens.');
  }
  return jwt.verify(token, JWT_SECRET);
}
