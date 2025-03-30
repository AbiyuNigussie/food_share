"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const CustomError_1 = require("../../utils/CustomError");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const email_1 = require("../../utils/email");
const prisma = new client_1.PrismaClient();
const register = (firstName, lastName, email, phoneNumber, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new CustomError_1.CustomError("Email already in use!", 400);
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create verification token
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        // Create a new user transaction
        const newUser = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield tx.user.create({
                data: { firstName, lastName, email, phoneNumber, password: hashedPassword, verificationToken },
            });
            yield tx.profile.create({
                data: { userId: user.id, img: '', bio: '' },
            });
            return user;
        }));
        const emailSubject = "Verify Your Email";
        const verificationUrl = `http://localhost:${process.env.PORT}/api/user/auth/verify-email?token=${verificationToken}`;
        const emailBody = `Click the following link to verify your email: ${verificationUrl}`;
        console.log("Verification URL:", verificationUrl);
        yield (0, email_1.sendEmail)(email, emailSubject, emailBody);
        const jwt_token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, 'secret');
        return { token: jwt_token };
    }
    catch (error) {
        throw error;
    }
});
exports.register = register;
