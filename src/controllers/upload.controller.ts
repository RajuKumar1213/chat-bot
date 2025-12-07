import { ApiError } from '../helpers/ApiError';
import { ApiResponse } from '../helpers/ApiResponse';
import { asyncHandler } from '../helpers/asyncHandler';
import { chunkText } from '../helpers/chunkText';
import { extractDocx, extractPdf, extractTxt } from '../helpers/extract';
import { Vector } from '../models/VectorCollections';
import { getEmbedding } from '../utils/ollama-embed';
import fs from 'fs';

export const uploadDocuments = asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || !files.length) {
    return res.status(400).json(new ApiError(400, 'No files uploaded!'));
  }

  // extract texts out of files
  for (let file of files) {
    let text: string = '';
    // Detect type
    if (file.mimetype === 'application/pdf') {
      text = await extractPdf(file.path);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractDocx(file.path);
    } else if (file.mimetype === 'text/plain') {
      text = extractTxt(file.path);
    } else {
      continue;
    }

    // chunking and embedding
    const chunks = chunkText(text);
    const embeddings: number[][] = [];

    for (let chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      embeddings.push(embedding);
    }

    console.log('🚀 Embedding done');

    const documentId = new Date().getTime().toString();

    // upload to vector db
    const result = await Vector.insertMany(
      chunks.map((c, idx) => ({
        chunk: c,
        embedding: embeddings[idx],
        documentId,
        fileName: file.originalname,
        uploadedAt: new Date(),
        index: idx,
      }))
    );

    if (!result) {
      return res.status(500).json(new ApiError(500, 'Failed to upload file!'));
    }

    console.log('🚀 Document Upload to DB');
    /// remove all files from uploads folder
    files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'File uploaded successfully!'));
  }
});
