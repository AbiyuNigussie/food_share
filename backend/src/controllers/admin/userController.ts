import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        firstName: true,
        lastName: true,
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
      status: user.isVerified ? 'Active' : 'Pending', // You can customize this
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};
