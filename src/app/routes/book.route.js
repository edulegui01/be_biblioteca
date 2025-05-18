import { Router } from 'express';
import { BookController } from '../controllers/book.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';
import { verifyRole } from '../middlewares/role.middleware.js';

const router = Router();

// Rutas públicas
router.get('/', BookController.findAll);
router.get('/:id', BookController.findOneById);

// Rutas protegidas (requieren autenticación)
router.use(verifyToken);

// Rutas que requieren rol de administrador
router.post('/', verifyRole([1]), BookController.create);
router.put('/:id', verifyRole([1]), BookController.update);
router.delete('/:id', verifyRole([1]), BookController.remove);
router.patch('/:id/availability', verifyRole([1]), BookController.updateAvailability);

export default router;
