import express from 'express';
const router = express.Router();

import {
  createCard,
  moveCard,
  updateCard,
  deleteCardPermanent, // <- Alterado aqui
} from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

// Rota para criar um cartão
router.route('/').post(protect, createCard);

// Novas rotas para um ID específico
router
  .route('/:id')
  .put(protect, updateCard)
  .delete(protect, deleteCardPermanent); // <- Alterado aqui

// Rota para mover um cartão
router.route('/:id/move').put(protect, moveCard);

export default router;