import { AuthService } from '../services/auth.service.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookies.js';
import { loginSchema, registerSchema, forgotPasswordSchema } from '../validators/auth.validators.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { token, user } = await AuthService.register(validatedData);

      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { token, user } = await AuthService.login(validatedData);

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      clearAuthCookie(res);
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const result = await AuthService.forgotPassword(email);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
