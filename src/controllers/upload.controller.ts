// import { ApiError } from '../helpers/ApiError';
// import { ApiResponse } from '../helpers/ApiResponse';
// import { asyncHandler } from '../helpers/asyncHandler';
// import { chunkText } from '../helpers/chunkText';
// import { extractDocx, extractPdf, extractTxt } from '../helpers/extract';
// import { Vector } from '../models/VectorCollections';
// import { getEmbedding } from '../utils/ollama-embed';
// import fs from 'fs';

// export const uploadDocuments = asyncHandler(async (req, res) => {
//   const files = req.files as Express.Multer.File[];
//   if (!files || !files.length) {
//     return res.status(400).json(new ApiError(400, 'No files uploaded!'));
//   }

//   // extract texts out of files
//   for (let file of files) {
//     let text: string = '';
//     // Detect type
//     if (file.mimetype === 'application/pdf') {
//       text = await extractPdf(file.path);
//     } else if (
//       file.mimetype ===
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     ) {
//       text = await extractDocx(file.path);
//     } else if (file.mimetype === 'text/plain') {
//       text = extractTxt(file.path);
//     } else {
//       continue;
//     }

//     // chunking and embedding
//     const chunks = chunkText(text);
//     const embeddings: number[][] = [];

//     for (let chunk of chunks) {
//       const embedding = await getEmbedding(chunk);
//       embeddings.push(embedding);
//     }

//     console.log('🚀 Embedding done');

//     const documentId = new Date().getTime().toString();

//     // upload to vector db
//     const result = await Vector.insertMany(
//       chunks.map((c, idx) => ({
//         chunk: c,
//         embedding: embeddings[idx],
//         documentId,
//         fileName: file.originalname,
//         uploadedAt: new Date(),
//         index: idx,
//       }))
//     );

//     if (!result) {
//       return res.status(500).json(new ApiError(500, 'Failed to upload file!'));
//     }

//     console.log('🚀 Document Upload to DB');
//     /// remove all files from uploads folder
//     files.forEach((file) => {
//       fs.unlinkSync(file.path);
//     });

//     return res
//       .status(200)
//       .json(new ApiResponse(200, result, 'File uploaded successfully!'));
//   }
// });

import { ApiError } from '../helpers/ApiError';
import { ApiResponse } from '../helpers/ApiResponse';
import { asyncHandler } from '../helpers/asyncHandler';
import { uploadQueue } from '../queues/upload.queue';

export const uploadDocuments = asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || !files.length) {
    return res.status(400).json(new ApiError(400, 'No files uploaded!'));
  }

  const job = await uploadQueue.add('process-documents', {
    files: files.map((f) => ({
      path: f.path,
      mimetype: f.mimetype,
      originalname: f.originalname,
    })),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { jobId: job.id }, 'Files queued for processing.')
    );
});

export const getJobStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await uploadQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json(new ApiError(404, 'Job not found'));
  }

  const state = await job.getState();
  const progress = job.progress;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobId: job.id,
        state,
        progress,
        data: job.returnvalue,
      },
      'Job status retrieved'
    )
  );
});
