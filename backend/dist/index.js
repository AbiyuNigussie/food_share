"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoute_1 = require("./routes/donor/authRoute");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
app.use('/api/donor/auth', authRoute_1.donorAuthRoutes);
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
