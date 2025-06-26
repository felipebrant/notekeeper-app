    import asyncHandler from 'express-async-handler';
    import Note from '../models/noteModel.js';

    const getNotes = asyncHandler(async (req, res) => {
      const notes = await Note.find({ user: req.user._id })
        .populate('tags', 'name color')
        .sort({ createdAt: -1 });
      
      const sortedNotes = notes.sort((a, b) => b.isPinned - a.isPinned);
      res.json(sortedNotes);
    });

   
    const createNote = asyncHandler(async (req, res) => {
      const { title, content, color, tags } = req.body;
      if (!content) {
        res.status(400);
        throw new Error('O campo de conteúdo é obrigatório.');
      }
      const note = await Note.create({
        user: req.user._id,
        title,
        content,
        color,
        tags
      });
      const createdNote = await Note.findById(note._id).populate('tags', 'name color');
      res.status(201).json(createdNote);
    });

    const updateNote = asyncHandler(async (req, res) => {
      const { title, content, color, isPinned, tags } = req.body;
      const note = await Note.findById(req.params.id);

      if (note) {
        if (note.user.toString() !== req.user._id.toString()) {
          res.status(401);
          throw new Error('Usuário não autorizado.');
        }

        note.title = title !== undefined ? title : note.title;
        note.content = content !== undefined ? content : note.content;
        note.color = color !== undefined ? color : note.color;
        note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;

        note.tags = tags !== undefined ? tags : note.tags;

        await note.save();
        const updatedNote = await Note.findById(note._id).populate('tags', 'name color');
        res.json(updatedNote);
      } else {
        res.status(404);
        throw new Error('Nota não encontrada.');
      }
    });


    const deleteNote = asyncHandler(async (req, res) => {
      const note = await Note.findById(req.params.id);
      if (note) {
        if (note.user.toString() !== req.user._id.toString()) {
          res.status(401);
          throw new Error('Usuário não autorizado.');
        }
        await Note.deleteOne({ _id: note._id });
        res.json({ message: 'Nota removida.' });
      } else {
        res.status(404);
        throw new Error('Nota não encontrada.');
      }
    });

    export { getNotes, createNote, updateNote, deleteNote };
    