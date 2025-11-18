import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js';
import List from '../models/listModel.js'; // 1. PRECISAMOS DE IMPORTAR O MOLDE DE LISTAS
import Card from '../models/cardModel.js';
import Comment from '../models/commentModel.js';
import User from '../models/userModel.js';

// --- FUNÇÃO DE CRIAR QUADRO (ATUALIZADA) ---
// @desc    Criar um novo Quadro
// @route   POST /api/boards
// @access  Privado (precisa de token)
const createBoard = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('O nome do quadro é obrigatório.');
  }

  // 1. Cria o quadro
  const board = await Board.create({
    name,
    owner: req.user._id,
  });

  if (board) {
    // 2. --- A NOVA MÁGICA ESTÁ AQUI ---
    // Se o quadro foi criado, cria as 3 listas (status) padrão
    try {
      await List.create([
        { name: "Pendente", board: board._id, position: 0 },
        { name: "Em Processo", board: board._id, position: 1 },
        { name: "Finalizado", board: board._id, position: 2 },
      ]);
    } catch (listError) {
      console.error("Falha ao criar listas padrão:", listError);
      // (Numa app de produção, poderíamos apagar o quadro se as listas falharem)
    }
    // 3. Devolve o quadro criado
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

// --- FUNÇÃO DE BUSCAR QUADRO POR ID (Sem alterações) ---
const getBoardById = asyncHandler(async (req, res) => {
  // (Código de getBoardById ... sem alterações)
  const board = await Board.findById(req.params.id).populate(
    'owner',
    'name email'
  ).populate(
    'members',
    'name email'
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

// --- FUNÇÃO DE REMOVER MEMBRO (Sem alterações) ---
const removeMemberFromBoard = asyncHandler(async (req, res) => {
  // (Código de removeMemberFromBoard ... sem alterações)
  const { id: boardId, memberId } = req.params;
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Apenas o dono do quadro pode remover membros.');
  }
  if (board.owner.toString() === memberId) {
    res.status(400);
    throw new Error('O dono não pode ser removido do quadro.');
  }
  board.members = board.members.filter(
    (m) => m.toString() !== memberId
  );
  await board.save();
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
  removeMemberFromBoard,
};