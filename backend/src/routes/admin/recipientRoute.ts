import express from "express";
import { authenticateAdmin } from "../../middlewares/authenticateAdmin";
import {
  listPendingRecipients,
  approveRecipient,
  rejectRecipient,
} from "../../controllers/admin/recipientController";

const router = express.Router();

// List all pending recipients
router.get("/pending", authenticateAdmin, listPendingRecipients);
// Approve recipient
router.patch("/:userId/approve", authenticateAdmin, approveRecipient);
// Reject recipient
router.delete("/:userId/reject", authenticateAdmin, rejectRecipient);

export default router;
