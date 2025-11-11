import express from 'express';
const router = express.Router();

// 1. Importa a nova função 'inviteMemberToBoard'
import {
  createBoard,
  getBoards,
  getBoardById,
  inviteMemberToBoard,
} from '../controllers/boardController.js';

import { protect } from '../middleware/authMiddleware.js';

// --- Definição das Rotas ----

// Rota principal: /api/boards
router.route('/').post(protect, createBoard).get(protect, getBoards);

// Rota para um ID específico: /api/boards/:id
router.route('/:id').get(protect, getBoardById);

// 2. Nova Rota para convidar: /api/boards/:id/invite
router.route('/:id/invite').post(protect, inviteMemberToBoard);

export default router;