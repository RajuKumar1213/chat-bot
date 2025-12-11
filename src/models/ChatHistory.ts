import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
