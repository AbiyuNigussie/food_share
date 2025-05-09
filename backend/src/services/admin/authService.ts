import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../../utils/CustomError";

const prisma = new PrismaClient();

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  secretKey: string
) => {
  try {
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new CustomError("Invalid secret key", 401);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new CustomError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword,
          role: "ADMIN",
          isVerified: true,
        },
      });

      await tx.admin.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });

    const jwt_token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      "secret"
    );
    return { token: jwt_token };
  } catch (error) {
    throw error;
  }
};

const login = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email, role: "ADMIN" },
    });

    if (!user) {
      throw new CustomError("Invalid email or password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid email or password", 400);
    }

    const jwt_token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "secret"
    );
    return {
      user: { id: user.id, email: user.email, role: user.role },
      token: jwt_token,
    };
  } catch (error) {
    throw error;
  }
};

export { register, login };
