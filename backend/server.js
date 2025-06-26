import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import tagRoutes from './routes/tagRoutes.js';


dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5000;

// ---- ROTAS DA APLICAÇÃO ----

app.get('/', (req, res) => {
  res.json({ message: 'API do NoteKeeper App está rodando!' });
});

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV}`);
});
