import express from 'express';
const router = express.Router();

import {
  createComment,
  getCommentsByCard,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

// Rota para criar um comentário
// (Não usamos :cardId no POST para manter o URL mais limpo,
// o ID do cartão virá no 'body' do pedido)
router.route('/').post(protect, createComment);

// Rota para buscar todos os comentários de um cartão específico
router.route('/:cardId').get(protect, getCommentsByCard);

export default router;