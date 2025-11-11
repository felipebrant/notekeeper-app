import asyncHandler from 'express-async-handler';
import Board from '../models/boardModel.js'; // Precisamos para verificar o dono
import List from '../models/listModel.js';   // O nosso novo "molde" de Lista

// @desc    Criar uma nova Lista (coluna)
// @route   POST /api/lists
// @access  Privado
const createList = asyncHandler(async (req, res) => {
  // O frontend precisa de nos enviar o nome da lista e a que quadro ela pertence
  const { name, boardId } = req.body;

  if (!name || !boardId) {
    res.status(400);
    throw new Error('O nome da lista e o ID do quadro são obrigatórios.');
  }

  // 1. Encontrar o quadro
  const board = await Board.findById(boardId);

  if (!board) {
    res.status(404);
    throw new Error('Quadro não encontrado.');
  }

  // 2. Verificar se o utilizador é o dono do quadro
  // (Mais tarde, podemos mudar isto para 'members' em vez de 'owner')
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(401); // Não autorizado
    throw new Error('Apenas o dono do quadro pode adicionar listas.');
  }

  // 3. Calcular a posição da nova lista
  // Vamos contar quantas listas já existem neste quadro
  const listCount = await List.countDocuments({ board: boardId });
  const position = listCount; // A nova lista será a última (posição 0, 1, 2...)

  // 4. Criar a lista
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

// Exporta as funções
export { createList };