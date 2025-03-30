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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const authService = require('../../services/user/authService.js');
const CustomError_1 = require("../../utils/CustomError");
const validate_1 = require("../../utils/validate");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            const error = new CustomError_1.CustomError("You should fill all fields ", 400);
            throw error;
        }
        if (password.length < 6) {
            const error = new CustomError_1.CustomError("The password should not be less that 6", 400);
            throw error;
        }
        const testEmail = (0, validate_1.isValidEmail)(email);
        if (!testEmail) {
            const error = new CustomError_1.CustomError("The email is not valid", 400);
            throw error;
        }
        const result = yield authService.register(firstName, lastName, email, phoneNumber, password);
        res.status(201).json({
            message: "User registered successfully!",
            token: result.token
        });
    }
    catch (error) {
        if (error instanceof CustomError_1.CustomError) {
            res.status(error.status || 500).json({ message: error.message });
        }
        else if (error instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});
exports.register = register;
