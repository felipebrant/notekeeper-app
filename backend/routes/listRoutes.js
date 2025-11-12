import express from 'express';
const router = express.Router();

import {
  createList,
  updateList,
  deleteList,
} from '../controllers/listController.js';
import { protect } from '../middleware/authMiddleware.js';

// Rota para criar lista
router.route('/').post(protect, createList);

// Novas rotas para um ID específico
router
  .route('/:id')
  .put(protect, updateList) // Renomear
  .delete(protect, deleteList); // Apagar

export default router;