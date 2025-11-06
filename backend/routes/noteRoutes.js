import express from 'express';
const router = express.Router();
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getTrashedNotes,
  restoreNote,
  deleteNotePermanent,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

// Rota principal para buscar notas ativas e criar novas notas
router.route('/').get(protect, getNotes).post(protect, createNote);

// --- NOVAS ROTAS DA LIXEIRA ---

// Rota para buscar notas na lixeira
router.route('/trash').get(protect, getTrashedNotes);

// Rota para restaurar uma nota
router.route('/:id/restore').post(protect, restoreNote);

// Rota para apagar permanentemente
router.route('/:id/permanent').delete(protect, deleteNotePermanent);

// --- ROTA DE NOTA INDIVIDUAL ---
// (Manter esta rota no fim para que as rotas /trash não sejam lidas como um :id)
router
  .route('/:id')
  .put(protect, updateNote) // Atualizar nota
  .delete(protect, deleteNote); // Mover para a lixeira (Soft Delete)

export default router;