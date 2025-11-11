import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // A que cartão este comentário pertence?
    card: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Card',
    },
    // Quem escreveu este comentário?
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;