import express from 'express';
const router = express.Router();

// Importa a nossa nova função
import { createList } from '../controllers/listController.js';
// Importa o "porteiro"
import { protect } from '../middleware/authMiddleware.js';

// Define a rota:
// Um 'POST' para '/api/lists' (que é a raiz '/')
// vai ser protegido e depois vai chamar a função 'createList'.
router.route('/').post(protect, createList);

export default router;