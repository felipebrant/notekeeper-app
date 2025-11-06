import mongoose from 'mongoose';

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Armazena o ID do usuário
      required: true,
      ref: 'User', // Cria uma referência ao nosso model 'User'
    },
    title: {
      type: String,
      required: false, // O título será opcional
    },
    content: {
      type: String,
      required: true, // O conteúdo é obrigatório
    },
    color: {
      type: String,
      default: '#FFFFFF', // Uma cor padrão (branco)
    },
    isPinned: {
      type: Boolean,
      default: false, // Por padrão, uma nota não é fixada
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    // --- NOVOS CAMPOS PARA A LIXEIRA ---
    isTrashed: {
      type: Boolean,
      default: false,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    // -------------------------------------
  },
  {
    timestamps: true, // Cria os campos `createdAt` e `updatedAt`
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;