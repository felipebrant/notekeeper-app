import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // A que quadro esta lista pertence?
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    // Posição da lista no quadro (para a ordem das colunas)
    // Ex: "A Fazer" = 0, "Em Progresso" = 1, "Concluído" = 2
    position: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const List = mongoose.model('List', listSchema);

export default List;