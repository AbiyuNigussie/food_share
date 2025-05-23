import { CustomError } from "../../utils/CustomError";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import sendEmail from "../../utils/email";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  role: Role,
  organization?: string // optional, only required for RECIPIENT
) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new CustomError("Email already in use!", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Transaction to create user + associated profile
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword,
          verificationToken,
          role: Role[role.toUpperCase() as keyof typeof Role],
        },
      });

      if (role.toUpperCase() === "DONOR") {
        await tx.donor.create({
          data: {
            userId: user.id,
            address: "", // You can update this in a separate profile update
          },
        });
      } else if (role.toUpperCase() === "RECIPIENT") {
        await tx.recipient.create({
          data: {
            userId: user.id,
            address: "",
            organization: organization || "", // Ensure it's set
            subscriptionStatus: "pending",
            subscriptionDate: new Date(),
          },
        });
      } else if (role.toUpperCase() === "LOGISTIC_PROVIDER") {
        await tx.logisticsStaff.create({
          data: {
            userId: user.id,
            role: "Driver", // default
            vehicleInfo: null,
            assignedZone: null,
          },
        });
      } else {
        throw new CustomError("Invalid role provided", 400);
      }

      return user;
    });

    // Optionally send verification email here
    const emailSubject = "Verify Your Email";
    // const verificationUrl = `http://localhost:${process.env.PORT}/api/user/auth/verify-email?token=${verificationToken}`;
    const verificationUrl = `http://localhost:${process.env.CLIENT_PORT}/verify-email?token=${verificationToken}`;
    const emailBody = `Click the following link to verify your email: ${verificationUrl}`;
    console.log("Verification URL:", verificationUrl);
    await sendEmail({ to: email, subject: emailSubject, text: emailBody });

    const jwt_token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      `${JWT_SECRET}`
    );
    return { token: jwt_token };
  } catch (error) {
    throw error;
  }
};

const verifyEmail = async (token: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });
    if (!user) {
      throw new CustomError("Invalid or expired token", 400);
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

const login = async (email: string, password: string, role: string) => {
  try {
    if (
      !["DONOR", "RECIPIENT", "LOGISTIC_PROVIDER"].includes(role.toUpperCase())
    ) {
      throw new CustomError("Invalid role specified", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        donor: true,
        recipient: true,
        logistics_staff: true,
      },
    });

    if (!user || user.role !== role.toUpperCase()) {
      throw new CustomError("Incorrect email or role!", 400);
    }

    if (!user.isVerified) {
      throw new CustomError("Please verify your email before logging in.", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Incorrect email or password!", 400);
    }

    const jwt_token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      `${JWT_SECRET}`,
      { expiresIn: "1h" }
    );

    return {
      user: { id: user.id, email: user.email, role: user.role },
      token: jwt_token,
    };
  } catch (error) {
    throw error;
  }
};

const sendPasswordResetLink = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, message: "User with this email does not exist." };
  }

  const token = jwt.sign({ userId: user.id }, "secret", { expiresIn: "15m" });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const emailContent = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: emailContent,
  });

  return { success: true };
};

const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, "secret") as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new CustomError("Invalid token or user not found.", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    throw new CustomError("Invalid or expired token.", 400);
  }
};

export { register, verifyEmail, login, sendPasswordResetLink, resetPassword };
