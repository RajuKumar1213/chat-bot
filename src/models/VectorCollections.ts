import mongoose from 'mongoose';

const VectorCollection = new mongoose.Schema(
  {
    chunk: {
      type: String,
      required: true,
    },
    embedding: {
      type: Array,
      required: true,
    },
    documentId: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Vector = mongoose.model('Vector', VectorCollection);
