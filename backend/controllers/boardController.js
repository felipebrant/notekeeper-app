import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js';
import List from '../models/listModel.js';
import Card from '../models/cardModel.js';
import Comment from '../models/commentModel.js';
import User from '../models/userModel.js';

// --- FUNÇÃO DE CRIAR QUADRO (Sem alterações) ---
const createBoard = asyncHandler(async (req, res) => {
  // (Código de createBoard ... sem alterações)
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('O nome do quadro é obrigatório.');
  }
  const board = await Board.create({
    name,
    owner: req.user._id,
  });
  if (board) {
    res.status(201).json(board);
  } else {
    res.status(400);
    throw new Error('Dados inválidos.');
  }
});

// --- FUNÇÃO DE BUSCAR QUADROS (Sem alterações) ---
const getBoards = asyncHandler(async (req, res) => {
  // (Código de getBoards ... sem alterações)
  const boards = await Board.find({
    members: { $in: [req.user._id] },
    isTrashed: false,
  }).sort({ createdAt: -1 });
  res.json(boards);
});

// --- FUNÇÃO DE BUSCAR QUADRO POR ID (ATUALIZADA) ---
// @desc    Buscar um Quadro único por ID (com listas e cartões)
// @route   GET /api/boards/:id
// @access  Privado
const getBoardById = asyncHandler(async (req, res) => {
  // 1. ATUALIZAÇÃO: Adicionamos .populate() para buscar os membros
  const board = await Board.findById(req.params.id).populate(
    'owner', // Busca o dono
    'name email' // E quer apenas o nome e email dele
  ).populate(
    'members', // Busca a lista de membros
    'name email' // E quer apenas o nome e email deles
  );

  if (!board || board.isTrashed) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  const isMember = board.members.some(
    (member) => member._id.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(401);
    throw new Error('Você não é membro deste quadro.');
  }

  const lists = await List.find({ board: board._id }).sort({ position: 1 });
  const cards = await Card.find({ board: board._id, isTrashed: false })
    .populate('tags', 'name color')
    .sort({ position: 1 });

  const populatedLists = lists.map((list) => {
    const cardsInList = cards.filter(
      (card) => card.list.toString() === list._id.toString()
    );
    return { ...list.toObject(), cards: cardsInList };
  });

  res.json({
    ...board.toObject(),
    lists: populatedLists,
  });
});

// --- FUNÇÃO DE CONVIDAR MEMBRO (Sem alterações) ---
const inviteMemberToBoard = asyncHandler(async (req, res) => {
  // (Código de inviteMemberToBoard ... sem alterações)
  const { email } = req.body;
  const boardId = req.params.id;
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Apenas o dono do quadro pode convidar membros.');
  }
  const userToInvite = await User.findOne({ email });
  if (!userToInvite) {
    res.status(404);
    throw new Error('Utilizador com este email não foi encontrado.');
  }
  const isAlreadyMember = board.members.some(
    (memberId) => memberId.toString() === userToInvite._id.toString()
  );
  if (isAlreadyMember) {
    res.status(400);
    throw new Error('Este utilizador já é membro do quadro.');
  }
  board.members.push(userToInvite._id);
  await board.save();
  const updatedBoard = await Board.findById(boardId).populate(
    'members',
    'name email'
  );
  res.json(updatedBoard.members);
});

// --- FUNÇÃO DE ATUALIZAR QUADRO (Sem alterações) ---
const updateBoard = asyncHandler(async (req, res) => {
  // (Código de updateBoard ... sem alterações)
  const { name } = req.body;
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Apenas o dono pode renomear o quadro.');
  }
  board.name = name || board.name;
  const updatedBoard = await board.save();
  res.json(updatedBoard);
});

// --- FUNÇÃO DE LIXEIRA DE QUADRO (Sem alterações) ---
const trashBoard = asyncHandler(async (req, res) => {
  // (Código de trashBoard ... sem alterações)
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Apenas o dono pode apagar o quadro.');
  }
  board.isTrashed = true;
  board.trashedAt = Date.now();
  await board.save();
  res.json({ message: 'Quadro movido para a lixeira.' });
});

// --- FUNÇÕES DE LIXEIRA (Sem alterações) ---
const getTrashedBoards = asyncHandler(async (req, res) => {
  // (Código de getTrashedBoards ... sem alterações)
  const boards = await Board.find({
    owner: req.user._id,
    isTrashed: true,
  }).sort({ trashedAt: -1 });
  res.json(boards);
});
const restoreBoard = asyncHandler(async (req, res) => {
  // (Código de restoreBoard ... sem alterações)
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Apenas o dono pode restaurar o quadro.');
  }
  board.isTrashed = false;
  board.trashedAt = null;
  await board.save();
  res.json({ message: 'Quadro restaurado com sucesso.' });
});
const deleteBoardPermanent = asyncHandler(async (req, res) => {
  // (Código de deleteBoardPermanent ... sem alterações)
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Apenas o dono pode apagar o quadro permanentemente.');
  }
  if (!board.isTrashed) {
    res.status(400);
    throw new Error('O quadro precisa de estar na lixeira para ser apagado.');
  }
  const cards = await Card.find({ board: board._id });
  const cardIds = cards.map(c => c._id);
  await Comment.deleteMany({ card: { $in: cardIds } });
  await Card.deleteMany({ board: board._id });
  await List.deleteMany({ board: board._id });
  await board.deleteOne();
  res.json({ message: 'Quadro e todos os seus dados foram apagados permanentemente.' });
});

// --- NOVA FUNÇÃO ---
// @desc    Remover um membro de um Quadro
// @route   DELETE /api/boards/:id/members/:memberId
// @access  Privado (Apenas Dono)
const removeMemberFromBoard = asyncHandler(async (req, res) => {
  const { id: boardId, memberId } = req.params;

  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  // 1. VERIFICAÇÃO DE SEGURANÇA: Só o dono pode remover membros
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Apenas o dono do quadro pode remover membros.');
  }
  
  // 2. VERIFICAÇÃO DE LÓGICA: Não pode remover o próprio dono
  if (board.owner.toString() === memberId) {
    res.status(400);
    throw new Error('O dono não pode ser removido do quadro.');
  }

  // 3. Remove o membro da lista
  board.members = board.members.filter(
    (m) => m.toString() !== memberId
  );
  
  await board.save();
  
  // 4. Devolve a nova lista de membros
  const updatedBoard = await Board.findById(boardId).populate(
    'members',
    'name email'
  );
  res.json(updatedBoard.members);
});


// Exporta todas as funções
export {
  createBoard,
  getBoards,
  getBoardById,
  inviteMemberToBoard,
  updateBoard,
  trashBoard,
  getTrashedBoards,
  restoreBoard,
  deleteBoardPermanent,
  removeMemberFromBoard, // <-- A nossa nova função
};