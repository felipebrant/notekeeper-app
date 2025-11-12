import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js';
import List from '../models/listModel.js';
import Card from '../models/cardModel.js';
import Comment from '../models/commentModel.js';

// --- FUNÇÃO DE CRIAR LISTA (Já existe, mantemos) ---
const createList = asyncHandler(async (req, res) => {
  const { name, boardId } = req.body;

  if (!name || !boardId) {
    res.status(400);
    throw new Error('O nome da lista e o ID do quadro são obrigatórios.');
  }

  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  // Agora, qualquer membro pode adicionar uma lista, não só o dono
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(401);
    throw new Error('Apenas membros do quadro podem adicionar listas.');
  }

  const listCount = await List.countDocuments({ board: boardId });
  const position = listCount;

  const list = await List.create({
    name,
    board: boardId,
    position,
  });

  if (list) {
    res.status(201).json(list);
  } else {
    res.status(400);
    throw new Error('Dados da lista inválidos.');
  }
});

// --- NOVA FUNÇÃO ---
// @desc    Atualizar uma Lista (mudar nome)
// @route   PUT /api/lists/:id
// @access  Privado (Apenas Membros)
const updateList = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const list = await List.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error('Lista não encontrada.');
  }

  // Verificar se o utilizador é membro do quadro
  const board = await Board.findById(list.board);
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(401);
    throw new Error('Apenas membros do quadro podem editar listas.');
  }

  list.name = name || list.name;
  const updatedList = await list.save();
  res.json(updatedList);
});

// --- NOVA FUNÇÃO ---
// @desc    Apagar uma Lista (e todos os seus cartões)
// @route   DELETE /api/lists/:id
// @access  Privado (Apenas Membros)
const deleteList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);

  if (!list) {
    res.status(404);
    throw new Error('Lista não encontrada.');
  }

  // Verificar se o utilizador é membro do quadro
  const board = await Board.findById(list.board);
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(401);
    throw new Error('Apenas membros do quadro podem apagar listas.');
  }

  // 1. Encontrar todos os cartões desta lista
  const cards = await Card.find({ list: list._id });
  const cardIds = cards.map(c => c._id);
  
  // 2. Apagar todos os comentários desses cartões
  await Comment.deleteMany({ card: { $in: cardIds } });

  // 3. Apagar todos os cartões
  await Card.deleteMany({ list: list._id });

  // 4. Apagar a lista
  await list.deleteOne();

  res.json({ message: 'Lista e todos os seus cartões foram apagados.' });
});


// Exporta todas as funções
export { createList, updateList, deleteList };