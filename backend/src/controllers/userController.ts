// src/controllers/userController.ts
import { Request, Response } from 'express';
import { prisma } from '../config/db';

interface IUserResponse {
    name: string;
    isAccountVerified: boolean;
}

interface GetUserRequest {
    userId: string;
}

export const getUserData = async (req: Request<{}, {}, GetUserRequest>, res: Response) => {
    try {
        const { userId } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                isAccountVerified: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            userData: user
        });

    } catch (error: any) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};