import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js'; // Precisamos de verificar os membros
import List from '../models/listModel.js';   // Precisamos de verificar se a lista existe
import Card from '../models/cardModel.js';   // O nosso "molde" de Cartão

// @desc    Criar um novo Cartão (tarefa)
// @route   POST /api/cards
// @access  Privado
const createCard = asyncHandler(async (req, res) => {
  // Para criar um cartão, precisamos de saber o título,
  // em qual lista ele entra, e em qual quadro.
  const { title, listId, boardId } = req.body;

  if (!title || !listId || !boardId) {
    res.status(400);
    throw new Error('O título, o ID da lista e o ID do quadro são obrigatórios.');
  }

  // 1. Verificar se o quadro existe
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  // 2. Verificar se a lista existe
  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error('Lista não encontrada.');
  }

  // 3. A VERIFICAÇÃO DE SEGURANÇA MAIS IMPORTANTE:
  // O utilizador que está a tentar criar o cartão é membro deste quadro?
  // O 'includes' precisa de uma conversão para 'string' para funcionar bem
  const isMember = board.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(401); // Não autorizado
    throw new Error('Você não é membro deste quadro.');
  }

  // 4. Calcular a posição do novo cartão
  // Contamos quantos cartões já existem *nesta lista*
  const cardCount = await Card.countDocuments({ list: listId });
  const position = cardCount; // O novo cartão será o último (posição 0, 1, 2...)

  // 5. Criar o cartão
  const card = await Card.create({
    title,
    board: boardId,
    list: listId,
    owner: req.user._id, // O 'dono' do cartão é quem o criou
    position,
    // (O resto dos campos, como 'content', 'color', etc.,
    // usarão os valores 'default' que definimos no modelo)
  });

  if (card) {
    res.status(201).json(card);
  } else {
    res.status(400);
    throw new Error('Dados do cartão inválidos.');
  }
});

// Exporta as funções
export { createCard };