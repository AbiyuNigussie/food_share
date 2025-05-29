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

const Needrouter = express.Router();

Needrouter.get("/needs", authenticateRecipient, handleGetAllNeeds);

Needrouter.post("/needs", authenticateRecipient, handleCreateNeed);

Needrouter.delete("/needs/:id", authenticateRecipient, handleDeleteNeed);

Needrouter.put("/needs/:id", authenticateRecipient, handleUpdateNeed);

Needrouter.get(
  "/needs/:id/matches",
  authenticateRecipient,
  handleFindMatchesForNeed
);

Needrouter.post(
  "/matches",
  authenticateRecipient,
  handleClaimMatch
);

export default Needrouter;
