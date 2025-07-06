import express from "express";
import { authenticateAdmin } from "../middlewares/authenticateAdmin";
import {
  fetchMessagesWithResponses,
  removeMessage,
  respondToMessage,
  submitContactMessage,
  updateResponse,
} from "../controllers/contactController";

const router = express.Router();

// Submit contact message (Public)
router.post("/", submitContactMessage);

// Admin response (Protected)
router.post("/response", authenticateAdmin, respondToMessage);

// Update Admin Response(Protected)
router.put("/responses/:responseId", authenticateAdmin, updateResponse);

// Get all messages with responses (Protected)
router.get("/messages", fetchMessagesWithResponses);

// Delete a message (Protected)
router.delete("/:messageId", authenticateAdmin, removeMessage);

export default router;
