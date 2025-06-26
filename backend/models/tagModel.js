import mongoose from 'mongoose';

const tagSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#E0E0E0', 
    },
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
