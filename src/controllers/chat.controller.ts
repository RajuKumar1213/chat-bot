import { ApiError } from '../helpers/ApiError';
import { ApiResponse } from '../helpers/ApiResponse';
import { asyncHandler } from '../helpers/asyncHandler';
import { askBot } from '../utils/chat';

const askToBot = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json(new ApiError(400, 'Query is required!'));
  }

  const answer = await askBot(query);
  res
    .status(200)
    .json(new ApiResponse(200, answer, 'Bot Responded Successfully!'));
});

export { askToBot };
