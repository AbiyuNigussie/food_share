import { CustomError } from "../../utils/CustomError";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from "../../utils/email";

const prisma = new PrismaClient();

const register = async (firstName: string, lastName: string, email: string, phoneNumber:string, password: string) => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new CustomError("Email already in use!", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create a new user transaction
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: { firstName, lastName, email, phoneNumber, password: hashedPassword, verificationToken, role:'DONOR' },
            });

            await tx.profile.create({
                data: { userId: user.id, img: '', bio: '' },
            });

            return user;
        });

        const emailSubject = "Verify Your Email";
        const verificationUrl = `http://localhost:${process.env.PORT}/api/donor/auth/verify-email?token=${verificationToken}`;
        const emailBody = `Click the following link to verify your email: ${verificationUrl}`;
        console.log("Verification URL:", verificationUrl);
        await sendEmail(email, emailSubject, emailBody);
        
        const jwt_token = jwt.sign({ id: newUser.id, email:newUser.email, role: newUser.role}, 'secret');
        return {token:jwt_token}
    } catch (error) {
        throw error;
    }
};

const verifyEmail = async (token: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });

        if (!user) {
             
            throw new CustomError('Invalid or expired token', 400);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
        });

        return;
    } catch (error) {
        throw error;
    }
};


const login = async (email:string, password:string) => {
    try {
        const user = await prisma.user.findUnique({where: {email, role:'DONOR'}});
        if (!user)
            throw new CustomError("Incorrect email or password!", 400);

        if (!user.isVerified) {
            throw new CustomError("Please verify your email before logging in.", 400);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("Incorrect email or password!", 400);
        }

        const jwt_token = jwt.sign({ id: user.id, email:user.email, role: user.role}, 'secret');
        return {token:jwt_token}

  } catch (error) {
        throw error
  }

}

export {register, verifyEmail, login}