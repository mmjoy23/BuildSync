import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'BuildSync API is running',
  });
});

export default router;
