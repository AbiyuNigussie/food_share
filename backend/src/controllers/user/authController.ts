import { Request, Response } from "express";
const authService = require("../../services/user/authService");
import { CustomError } from "../../utils/CustomError";
import { isValidEmail } from "../../utils/validate";
import { Role } from "@prisma/client";
const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      organization, // from frontend
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !role
    ) {
      throw new CustomError("You should fill all fields", 400);
    }

    // Validate role
    if (!["DONOR", "RECIPIENT", "LOGISTIC_PROVIDER"].includes(role)) {
      throw new CustomError("Invalid role specified", 400);
    }

    // Validate organization for recipients
    if (role === "RECIPIENT" && !organization) {
      throw new CustomError("Organization is required for recipients", 400);
    }

    if (password.length < 6) {
      throw new CustomError(
        "The password should not be less than 6 characters",
        400
      );
    }

    if (!isValidEmail(email)) {
      throw new CustomError("The email is not valid", 400);
    }

    // Call authService and include organization
    const result = await authService.register(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      organization // optional for others, required for recipients
    );

    res.status(201).json({
      message: "User registered successfully!",
      token: result.token,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status || 500).json({ message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const user = await authService.verifyEmail(token);

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new CustomError("You should fill all fields", 400);
    }

    const success = await authService.login(email, password, role);

    res.status(200).json({
      user: success.user,
      token: success.token,
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.status || 500).json({ message: error.message });
    } else if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required." });
  }

  try {
    const result = await authService.sendPasswordResetLink(email);
    if (!result.success) {
      res.status(404).json({ message: result.message });
    }

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: "Password is required." });
  }
  try {
    await authService.resetPassword(token, password);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Failed to reset password." });
  }
};

export { register, verifyEmail, login, forgotPassword, resetPassword };
