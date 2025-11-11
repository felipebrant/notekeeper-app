import path from 'path'; // 1. Precisamos do 'path'
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; // 2. Importar a nova rota

// Carrega as variáveis de ambiente
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Configuração do CORS (importante!)
app.use(
  cors({
    origin: 'http://localhost:5173', // Permite o frontend
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

// ---- ROTAS DA APLICAÇÃO ----
app.get('/', (req, res) => {
  res.json({ message: 'API do NoteKeeper App está a rodar!' });
});

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/upload', uploadRoutes); // 3. Usar a nova rota de upload

// --- SERVIR A PASTA DE UPLOADS (MUITO IMPORTANTE) ---
// 4. Torna a pasta 'uploads' acessível publicamente
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// "Liga" o servidor
app.listen(PORT, () => {
  console.log(
    `Servidor a rodar na porta ${PORT} no modo ${process.env.NODE_ENV}`
  );
});