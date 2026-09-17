import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';

export function formatSafeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export class AuthService {
  static async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Use generic error for non-existent user to avoid account enumeration
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (user.status === 'SUSPENDED') {
      const error = new Error('Your account has been suspended. Please contact support.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: formatSafeUser(user),
    };
  }

  static async register({ name, email, password, phone, role }) {
    // Explicit security enforcement against ADMIN registration
    if (role === 'ADMIN') {
      const error = new Error('Administrator accounts cannot be registered publicly.');
      error.statusCode = 403;
      throw error;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'TENANT',
        phone: phone || null,
        status: 'ACTIVE',
      },
    });

    const token = signToken({
      userId: newUser.id,
      role: newUser.role,
    });

    return {
      token,
      user: formatSafeUser(newUser),
    };
  }

  static async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error('User not found or session expired');
      error.statusCode = 401;
      throw error;
    }

    if (user.status === 'SUSPENDED') {
      const error = new Error('Your account has been suspended. Please contact support.');
      error.statusCode = 403;
      throw error;
    }

    return formatSafeUser(user);
  }

  static async forgotPassword(email) {
    // Non-destructive, timing-safe lookup (in future, generates reset token and sends email)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.status !== 'SUSPENDED') {
      // Future Phase: generate password reset token and dispatch email
    }

    return {
      success: true,
      message: 'If an account exists for this email, password reset instructions will be sent.',
    };
  }
}
