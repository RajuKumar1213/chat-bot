import { Router } from "express";
import { askBot } from "../chat.js";

const router = Router();

router.post("/ask", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const answer = await askBot(query);
    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
