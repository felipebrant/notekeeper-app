import express from 'express';
const router = express.Router();

import {
  createBoard,
  getBoards,
  getBoardById,
  inviteMemberToBoard,
  updateBoard,
  trashBoard,
  getTrashedBoards,
  restoreBoard,
  deleteBoardPermanent,
  removeMemberFromBoard, // 1. Importamos a nova função
} from '../controllers/boardController.js';

import { protect } from '../middleware/authMiddleware.js';

// Rota principal: /api/boards
router.route('/').post(protect, createBoard).get(protect, getBoards);

// Rota para a lixeira de quadros
router.route('/trash').get(protect, getTrashedBoards);

// Rota para um ID específico: /api/boards/:id
router
  .route('/:id')
  .get(protect, getBoardById)
  .put(protect, updateBoard)
  .delete(protect, trashBoard);

// Rota para convidar
router.route('/:id/invite').post(protect, inviteMemberToBoard);

// Rota para restaurar
router.route('/:id/restore').put(protect, restoreBoard);

// Rota para apagar permanentemente
router.route('/:id/permanent').delete(protect, deleteBoardPermanent);

// 2. NOVA ROTA para remover um membro
// Ex: DELETE /api/boards/(id-do-quadro)/members/(id-do-membro)
router
  .route('/:id/members/:memberId')
  .delete(protect, removeMemberFromBoard);

export default router;