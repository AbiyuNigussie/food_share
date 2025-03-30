"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donorAuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../../controllers/donor/authController");
const router = express_1.default.Router();
router.post('/', authController_1.register);
exports.donorAuthRoutes = router;
