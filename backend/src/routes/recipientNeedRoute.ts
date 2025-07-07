import express from "express";
import {
  handleCreateNeed,
  handleGetAllNeeds,
  handleDeleteNeed,
  handleUpdateNeed,
  handleFindMatchesForNeed,
  handleClaimMatch,
} from "../controllers/recipientNeedController";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";
import { requireApprovedAndSubscribedRecipient } from "../middlewares/requireApprovedAndSubscribedRecipient";

const Needrouter = express.Router();

Needrouter.get(
  "/needs",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleGetAllNeeds
);
Needrouter.post(
  "/needs",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleCreateNeed
);
Needrouter.delete(
  "/needs/:id",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleDeleteNeed
);
Needrouter.put(
  "/needs/:id",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleUpdateNeed
);
Needrouter.get(
  "/needs/:id/matches",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleFindMatchesForNeed
);
Needrouter.post(
  "/matches",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleClaimMatch
);

export default Needrouter;
