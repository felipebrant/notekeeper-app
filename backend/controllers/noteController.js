import asyncHandler from 'express-async-handler';
import Note from '../models/noteModel.js';

// --- FUNÇÃO DE CRIAR NOTA (ATUALIZADA) ---
// @desc    Criar uma nova nota
// @route   POST /api/notes
// @access  Privado
const createNote = asyncHandler(async (req, res) => {
  // 1. Adicionámos 'imageUrl'
  const { title, content, color, tags, imageUrl } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('O conteúdo da nota não pode estar vazio.');
  }

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    color,
    tags,
    imageUrl, // 2. Guardamos o 'imageUrl'
  });

  if (note) {
    const populatedNote = await Note.findById(note._id).populate(
      'tags',
      'name color'
    );
    res.status(201).json(populatedNote);
  } else {
    res.status(400);
    throw new Error('Dados da nota inválidos.');
  }
});

// --- FUNÇÃO DE ATUALIZAR NOTA (ATUALIZADA) ---
// @desc    Atualizar uma nota
// @route   PUT /api/notes/:id
// @access  Privado
const updateNote = asyncHandler(async (req, res) => {
  // 1. Adicionámos 'imageUrl'
  const { title, content, color, tags, imageUrl, isPinned } = req.body;

  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Nota não encontrada');
  }

  // Verificar se o utilizador é o dono da nota
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Utilizador não autorizado');
  }

  // Atualiza apenas os campos que foram enviados
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (color !== undefined) note.color = color;
  if (tags !== undefined) note.tags = tags;
  if (isPinned !== undefined) note.isPinned = isPinned;
  // 2. Adicionámos a lógica para atualizar o 'imageUrl'
  if (imageUrl !== undefined) note.imageUrl = imageUrl;

  const updatedNote = await note.save();
  const populatedNote = await Note.findById(updatedNote._id).populate(
    'tags',
    'name color'
  );

  res.json(populatedNote);
});

// --- O RESTO DAS FUNÇÕES (getNotes, deleteNote, etc.) ---
// (Não precisam de ser alteradas, mas estão aqui para o ficheiro ficar completo)

// @desc    Buscar todas as notas ativas do utilizador
// @route   GET /api/notes
// @access  Privado
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
    isTrashed: false, // Apenas notas que NÃO estão na lixeira
  })
    .populate('tags', 'name color')
    .sort({ isPinned: -1, updatedAt: -1 }); // Fixadas primeiro, depois as mais recentes

  res.json(notes);
});

// @desc    Mover nota para a lixeira (Soft Delete)
// @route   DELETE /api/notes/:id
// @access  Privado
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Nota não encontrada');
  }

  // Verificar se o utilizador é o dono
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Utilizador não autorizado');
  }

  note.isTrashed = true;
  note.trashedAt = Date.now();
  await note.save();

  res.json({ message: 'Nota movida para a lixeira' });
});

// @desc    Buscar notas na lixeira
// @route   GET /api/notes/trash
// @access  Privado
const getTrashedNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
    isTrashed: true,
  })
    .populate('tags', 'name color')
    .sort({ trashedAt: -1 }); // Mais recentes na lixeira primeiro

  res.json(notes);
});

// @desc    Restaurar nota da lixeira
// @route   PUT /api/notes/:id/restore
// @access  Privado
const restoreNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Nota não encontrada');
  }

  // Verificar se o utilizador é o dono
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Utilizador não autorizado');
  }

  note.isTrashed = false;
  note.trashedAt = null;
  await note.save();

  res.json({ message: 'Nota restaurada com sucesso' });
});

// @desc    Apagar nota permanentemente
// @route   DELETE /api/notes/:id/permanent
// @access  Privado
const deleteNotePermanent = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Nota não encontrada');
  }

  // Verificar se o utilizador é o dono
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Utilizador não autorizado');
  }

  // Garantir que a nota está na lixeira antes de apagar (opcional, mas é uma boa prática)
  if (!note.isTrashed) {
    res.status(400);
    throw new Error('Apenas notas na lixeira podem ser apagadas permanentemente.');
  }

  await note.deleteOne();

  res.json({ message: 'Nota apagada permanentemente' });
});

export {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getTrashedNotes,
  restoreNote,
  deleteNotePermanent,
};