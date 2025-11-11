import express from 'express';
const router = express.Router();

// Importa a nossa nova função
import { createCard } from '../controllers/cardController.js';
// Importa o "porteiro"
import { protect } from '../middleware/authMiddleware.js';

// Define a rota:
// Um 'POST' para '/api/cards' (que é a raiz '/')
// vai ser protegido e depois vai chamar a função 'createCard'.
router.route('/').post(protect, createCard);

export default router;