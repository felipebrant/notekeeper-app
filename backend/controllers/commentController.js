import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';
import Card from '../models/cardModel.js';
import Board from '../models/boardModel.js';

// @desc    Criar um novo comentário num cartão
// @route   POST /api/comments
// @access  Privado (Apenas Membros do Quadro)
const createComment = asyncHandler(async (req, res) => {
  const { content, cardId, boardId } = req.body;

  if (!content || !cardId || !boardId) {
    res.status(400);
    throw new Error('Conteúdo, ID do cartão e ID do quadro são obrigatórios.');
  }

  // 1. Verificar se o quadro existe
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  // 2. Verificar se o cartão existe
  const card = await Card.findById(cardId);
  if (!card) {
    res.status(404);
    throw new Error('Cartão não encontrado.');
  }

  // 3. VERIFICAÇÃO DE SEGURANÇA: O utilizador é membro deste quadro?
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(401); // Não autorizado
    throw new Error('Você não é membro deste quadro e não pode comentar.');
  }

  // 4. Criar o comentário
  const comment = await Comment.create({
    content,
    card: cardId,
    user: req.user._id, // O autor é o utilizador logado
  });

  // 5. Popular o comentário com os dados do autor (nome)
  const populatedComment = await Comment.findById(comment._id).populate(
    'user',
    'name email'
  );

  res.status(201).json(populatedComment);
});

// @desc    Buscar todos os comentários de um cartão
// @route   GET /api/comments/:cardId
// @access  Privado (Apenas Membros)
const getCommentsByCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;

  // 1. Encontrar o cartão
  const card = await Card.findById(cardId);
  if (!card) {
    res.status(404);
    throw new Error('Cartão não encontrado.');
  }

  // 2. Encontrar o quadro a que o cartão pertence
  const board = await Board.findById(card.board);
  if (!board) {
    res.status(404);
    throw new Error('Quadro associado não encontrado.');
  }

  // 3. VERIFICAÇÃO DE SEGURANÇA: O utilizador é membro?
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(401);
    throw new Error('Você não é membro deste quadro e não pode ver os comentários.');
  }

  // 4. Buscar todos os comentários
  const comments = await Comment.find({ card: cardId })
    .populate('user', 'name email') // Envia o nome e email do autor do comentário
    .sort({ createdAt: 1 }); // Ordena do mais antigo para o mais recente (ordem de chat)

  res.json(comments);
});

export { createComment, getCommentsByCard };