import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';
import { verifyRole } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', verifyToken, verifyRole([1]), UserController.findAll);

export default router;
