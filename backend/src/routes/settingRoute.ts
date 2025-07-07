// src/routes/user.routes.ts
import express from "express";
import {
  handleUpdateProfile,
  handleChangePassword,
} from "../controllers/settingController";
import { authenticateUser } from "../middlewares/authenticateAnyUser";

const Srouter = express.Router();

Srouter.put("/user/profile", authenticateUser, handleUpdateProfile);

Srouter.post("/user/change-password", authenticateUser, handleChangePassword);

export default Srouter;
