import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js';
import List from '../models/listModel.js';
import Card from '../models/cardModel.js';
import User from '../models/userModel.js'; // 1. Precisamos do Molde 'User' para procurar por email

// --- FUNÇÃO DE CRIAR QUADRO (Já existe, mantemos) ---
const createBoard = asyncHandler(async (req, res) => {
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

// --- FUNÇÃO DE BUSCAR QUADROS (Já existe, mantemos) ---
const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({
    members: { $in: [req.user._id] },
  }).sort({ createdAt: -1 });
  res.json(boards);
});

// --- FUNÇÃO DE BUSCAR QUADRO POR ID (Já existe, mantemos) ---
const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(401);
    throw new Error('Você não é membro deste quadro.');
  }

  const lists = await List.find({ board: board._id }).sort({ position: 1 });

  const cards = await Card.find({ board: board._id })
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

// --- NOVA FUNÇÃO ---
// @desc    Convidar um utilizador para um Quadro
// @route   POST /api/boards/:id/invite
// @access  Privado (Apenas o Dono)
const inviteMemberToBoard = asyncHandler(async (req, res) => {
  // 1. O frontend vai enviar o email do utilizador a convidar
  const { email } = req.body;
  const boardId = req.params.id;

  // 2. Encontrar o quadro
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  // 3. VERIFICAÇÃO DE SEGURANÇA: Só o dono pode convidar
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401); // Não autorizado
    throw new Error('Apenas o dono do quadro pode convidar membros.');
  }

  // 4. Encontrar o utilizador a convidar pelo seu email
  const userToInvite = await User.findOne({ email });
  if (!userToInvite) {
    res.status(404);
    throw new Error('Utilizador com este email não foi encontrado.');
  }

  // 5. VERIFICAÇÃO DE LÓGICA: O utilizador já é membro?
  const isAlreadyMember = board.members.some(
    (memberId) => memberId.toString() === userToInvite._id.toString()
  );
  if (isAlreadyMember) {
    res.status(400); // Bad Request
    throw new Error('Este utilizador já é membro do quadro.');
  }

  // 6. Adicionar o novo membro e salvar
  board.members.push(userToInvite._id);
  await board.save();

  // 7. Popular os dados dos membros para enviar de volta (opcional, mas bom para o frontend)
  const updatedBoard = await Board.findById(boardId).populate(
    'members',
    'name email'
  );

  res.json(updatedBoard.members);
});

// Exporta as funções (antigas e a nova)
export { createBoard, getBoards, getBoardById, inviteMemberToBoard };