import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js';
import List from '../models/listModel.js';
import Card from '../models/cardModel.js';
import Comment from '../models/commentModel.js';

// --- FUNÇÃO DE CRIAR CARTÃO (Sem alterações) ---
const createCard = asyncHandler(async (req, res) => {
  const { title, listId, boardId } = req.body;
  if (!title || !listId || !boardId) {
    res.status(400);
    throw new Error('O título, o ID da lista e o ID do quadro são obrigatórios.');
  }
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }
  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error('Lista não encontrada.');
  }
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(401);
    throw new Error('Você não é membro deste quadro.');
  }
  const cardCount = await Card.countDocuments({ list: listId });
  const position = cardCount;
  const card = await Card.create({
    title,
    board: boardId,
    list: listId,
    owner: req.user._id,
    position,
  });
  if (card) {
    res.status(201).json(card);
  } else {
    res.status(400);
    throw new Error('Dados do cartão inválidos.');
  }
});

// --- FUNÇÃO DE MOVER CARTÃO (Sem alterações) ---
const moveCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newListId, newPosition, oldListId } = req.body;

  if (newListId === undefined || newPosition === undefined || oldListId === undefined) {
    res.status(400);
    throw new Error('Os campos newListId, newPosition e oldListId são obrigatórios.');
  }

  try {
    const card = await Card.findById(id);

    if (!card) {
      res.status(404);
      throw new Error('Cartão não encontrado.');
    }
    
    const board = await Board.findById(card.board);
    if (!board) {
      res.status(404);
      throw new Error('Quadro associado ao cartão não encontrado.');
    }
    const isMember = board.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );
    if (!isMember) {
      res.status(401);
      throw new Error('Você não é membro deste quadro.');
    }

    const oldPos = card.position;

    if (oldListId === newListId) {
      if (newPosition > oldPos) {
        await Card.updateMany(
          { list: oldListId, position: { $gt: oldPos, $lte: newPosition } },
          { $inc: { position: -1 } }
        );
      } else if (newPosition < oldPos) {
        await Card.updateMany(
          { list: oldListId, position: { $gte: newPosition, $lt: oldPos } },
          { $inc: { position: 1 } }
        );
      }
    } else {
      await Card.updateMany(
        { list: oldListId, position: { $gt: oldPos } },
        { $inc: { position: -1 } }
      );
      await Card.updateMany(
        { list: newListId, position: { $gte: newPosition } },
        { $inc: { position: 1 } }
      );
    }

    card.list = newListId;
    card.position = newPosition;
    await card.save();

    res.json({ message: 'Cartão movido com sucesso.' });

  } catch (error) {
    console.error('Erro ao mover cartão:', error);
    res.status(500);
    throw new Error('Erro no servidor ao mover o cartão.');
  }
});

// --- FUNÇÃO DE ATUALIZAR CARTÃO (ATUALIZADA) ---
// @desc    Atualizar um cartão (título, conteúdo, etc.)
// @route   PUT /api/cards/:id
// @access  Privado (Apenas Membros)
const updateCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // 1. APAGÁMOS 'content' e 'tags' daqui
  const { title, imageUrl } = req.body;

  const card = await Card.findById(id);

  if (!card) {
    res.status(404);
    throw new Error('Cartão não encontrado.');
  }

  const board = await Board.findById(card.board);
  if (!board) {
    res.status(404);
    throw new Error('Quadro associado ao cartão não encontrado.');
  }
  
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(401);
    throw new Error('Você não é membro deste quadro.');
  }

  // Atualiza os campos
  card.title = title || card.title;
  card.imageUrl = imageUrl !== undefined ? imageUrl : card.imageUrl;
  // 2. A lógica de 'content' e 'tags' foi removida

  const updatedCard = await card.save();
  // 3. Removemos o 'populate' de tags, já não é necessário
  // await updatedCard.populate('tags', 'name color');

  res.json(updatedCard);
});


// --- FUNÇÃO DE APAGAR CARTÃO (Sem alterações) ---
const deleteCardPermanent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const card = await Card.findById(id);

  if (!card) {
    res.status(404);
    throw new Error('Cartão não encontrado.');
  }

  const board = await Board.findById(card.board);
  if (!board) {
    res.status(404);
    throw new Error('Quadro associado ao cartão não encontrado.');
  }

  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );
  const isOwner = card.owner.toString() === req.user._id.toString();
  const isBoardOwner = board.owner.toString() === req.user._id.toString();

  if (!isMember || !(isOwner || isBoardOwner)) {
    res.status(401);
    throw new Error('Você não tem permissão para apagar este cartão.');
  }
  
  await Card.updateMany(
    { list: card.list, position: { $gt: card.position } },
    { $inc: { position: -1 } }
  );
  await Comment.deleteMany({ card: card._id });
  await card.deleteOne();
  
  res.json({ message: 'Cartão e comentários associados apagados permanentemente.' });
});


// Exporta todas as funções
export { createCard, moveCard, updateCard, deleteCardPermanent };