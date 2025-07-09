import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../../utils/CustomError";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

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
    // find admin by email + role
    const user = await prisma.user.findFirst({
      where: { email, role: "ADMIN" },
      select: {
        id: true,
        email: true,
        password: true,       // needed for bcrypt.compare
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
      },
    });

    if (!user) {
      throw new CustomError("Invalid email or password", 400);
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid email or password", 400);
    }

    // issue a 24 h JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET!,
      { expiresIn: "24h" }
    );

    // return identical shape to your user-login
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

export { register, login };
