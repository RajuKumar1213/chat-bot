import { ApiError } from '../helpers/ApiError';
import { ApiResponse } from '../helpers/ApiResponse';
import { asyncHandler } from '../helpers/asyncHandler';
import { askBot } from '../utils/chat';
import { ChatHistory } from '../models/ChatHistory';

const askToBot = asyncHandler(async (req, res) => {
  const { query, sessionId } = req.body;

  if (!query || !sessionId) {
    return res
      .status(400)
      .json(new ApiError(400, 'Query and sessionId are required!'));
  }

  const answer = await askBot(query, sessionId);
  res
    .status(200)
    .json(new ApiResponse(200, answer, 'Bot Responded Successfully!'));
});

const getChatHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const allHistory = await ChatHistory.find({ sessionId })
    .sort({ createdAt: 1 })
    .select('role content createdAt -_id');

  const structured = [];
  for (let i = 0; i < allHistory.length; i++) {
    if (allHistory[i].role === 'user') {
      structured.push(allHistory[i]);
      if (allHistory[i + 1]?.role === 'assistant') {
        structured.push(allHistory[i + 1]);
        i++;
      }
    }
  }

  const history = structured.slice(-20);

  res.status(200).json(new ApiResponse(200, history, 'Chat history fetched!'));
});

export { askToBot, getChatHistory };
