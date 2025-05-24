import express from "express";
import {
  handleCreateNeed,
  handleGetAllNeeds,
  handleDeleteNeed,
  handleUpdateNeed,
} from "../controllers/recipientNeedController";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";

const Needrouter = express.Router();

Needrouter.get("/needs", authenticateRecipient, handleGetAllNeeds);

Needrouter.post("/needs", authenticateRecipient, handleCreateNeed);

Needrouter.delete("/needs/:id", authenticateRecipient, handleDeleteNeed);

Needrouter.put("/needs/:id", authenticateRecipient, handleUpdateNeed);

export default Needrouter;
