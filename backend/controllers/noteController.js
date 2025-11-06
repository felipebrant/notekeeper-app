import asyncHandler from 'express-async-handler';
import Note from '../models/noteModel.js';

// --- FUNÇÕES EXISTENTES MODIFICADAS ---

// @desc    Buscar todas as notas ativas do usuário
// @route   GET /api/notes
// @access  Privado
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
    isTrashed: false, // MODIFICADO: Apenas notas que não estão na lixeira
  }).populate('tags'); // Continua a popular os marcadores

  res.json(notes);
});

// @desc    Criar uma nova nota
// @route   POST /api/notes
// @access  Privado
const createNote = asyncHandler(async (req, res) => {
  const { title, content, color, tags } = req.body;

  const note = new Note({
    user: req.user._id,
    title,
    content,
    color,
    tags,
  });

  const createdNote = await note.save();
  const populatedNote = await Note.findById(createdNote._id).populate('tags'); // Popula após salvar
  res.status(201).json(populatedNote);
});

// @desc    Atualizar uma nota
// @route   PUT /api/notes/:id
// @access  Privado
const updateNote = asyncHandler(async (req, res) => {
  const { title, content, color, isPinned, tags } = req.body;
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.color = color ?? note.color;
    note.isPinned = isPinned ?? note.isPinned;
    note.tags = tags ?? note.tags;

    const updatedNote = await note.save();
    const populatedNote = await Note.findById(updatedNote._id).populate('tags');
    res.json(populatedNote);
  } else {
    res.status(404);
    throw new Error('Nota não encontrada ou utilizador não autorizado');
  }
});

// @desc    Mover uma nota para a lixeira (Soft Delete)
// @route   DELETE /api/notes/:id
// @access  Privado
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    // MODIFICADO: Em vez de apagar, move para a lixeira
    note.isTrashed = true;
    note.trashedAt = new Date();
    await note.save();
    res.json({ message: 'Nota movida para a lixeira' });
  } else {
    res.status(404);
    throw new Error('Nota não encontrada ou utilizador não autorizado');
  }
});

// --- NOVAS FUNÇÕES DA LIXEIRA ---

// @desc    Buscar todas as notas na lixeira
// @route   GET /api/notes/trash
// @access  Privado
const getTrashedNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    user: req.user._id,
    isTrashed: true, // Apenas notas na lixeira
  }).populate('tags'); // Também popula os marcadores
  res.json(notes);
});

// @desc    Restaurar uma nota da lixeira
// @route   POST /api/notes/:id/restore
// @access  Privado
const restoreNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    note.isTrashed = false;
    note.trashedAt = null;
    const restoredNote = await note.save();
    const populatedNote = await Note.findById(restoredNote._id).populate('tags');
    res.json(populatedNote);
  } else {
    res.status(404);
    throw new Error('Nota não encontrada ou utilizador não autorizado');
  }
});

// @desc    Apagar permanentemente uma nota
// @route   DELETE /api/notes/:id/permanent
// @access  Privado
const deleteNotePermanent = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    await note.deleteOne(); // Usa deleteOne() (ou remove())
    res.json({ message: 'Nota apagada permanentemente' });
  } else {
    res.status(404);
    throw new Error('Nota não encontrada ou utilizador não autorizado');
  }
});

// --- EXPORTS ---
export {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getTrashedNotes,
  restoreNote,
  deleteNotePermanent,
};