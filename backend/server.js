import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import listRoutes from './routes/listRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
// 1. Importamos as nossas novas rotas de comentários
import commentRoutes from './routes/commentRoutes.js';

// Carrega as variáveis de ambiente
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Configuração do CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

// ---- ROTAS DA APLICAÇÃO ----
app.get('/', (req, res) => {
  res.json({ message: 'API do NoteKeeper App está a rodar!' });
});

// Rotas do Módulo de Notas Antigo (mantemos)
import noteRoutes from './routes/noteRoutes.js';
app.use('/api/notes', noteRoutes);

// Rotas de Utilizador, Tags e Uploads (mantemos)
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/upload', uploadRoutes);

// 2. Adicionamos as novas rotas do Trello
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/comments', commentRoutes); // <-- NOVA LINHA

// --- SERVIR A PASTA DE UPLOADS ---
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// "Liga" o servidor
app.listen(PORT, () => {
  console.log(
    `Servidor a rodar na porta ${PORT} no modo ${process.env.NODE_ENV}`
  );
});