    import asyncHandler from 'express-async-handler';
    import Tag from '../models/tagModel.js';

    const getTags = asyncHandler(async (req, res) => {
      const tags = await Tag.find({ user: req.user._id });
      res.json(tags);
    });

    const createTag = asyncHandler(async (req, res) => {
      const { name, color } = req.body;
      if (!name) {
        res.status(400);
        throw new Error('O nome do marcador é obrigatório.');
      }
      const tagExists = await Tag.findOne({ user: req.user._id, name });
      if (tagExists) {
        res.status(400);
        throw new Error('Marcador já existe.');
      }
      const tag = await Tag.create({ user: req.user._id, name, color });
      res.status(201).json(tag);
    });

    const updateTag = asyncHandler(async (req, res) => {
      const tag = await Tag.findById(req.params.id);
      if (tag && tag.user.toString() === req.user._id.toString()) {
        tag.name = req.body.name || tag.name;
        tag.color = req.body.color || tag.color;
        const updatedTag = await tag.save();
        res.json(updatedTag);
      } else {
        res.status(404);
        throw new Error('Marcador não encontrado ou usuário não autorizado.');
      }
    });

    const deleteTag = asyncHandler(async (req, res) => {
      const tag = await Tag.findById(req.params.id);
      if (tag && tag.user.toString() === req.user._id.toString()) {
        await Tag.deleteOne({ _id: req.params.id });
        res.json({ message: 'Marcador removido.' });
      } else {
        res.status(404);
        throw new Error('Marcador não encontrado ou usuário não autorizado.');
      }
    });

    export { getTags, createTag, updateTag, deleteTag };
    