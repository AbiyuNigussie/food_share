import express from "express";
import { getAllUsers, editUser } from "../../controllers/admin/userController";

const router = express.Router();

router.get("/users", getAllUsers);
router.put("/users/:id", editUser);

export default router;
