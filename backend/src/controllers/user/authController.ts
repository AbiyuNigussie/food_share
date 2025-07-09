import { Request, Response } from "express";
const authService = require("../../services/user/authService");
import { CustomError } from "../../utils/CustomError";
import { isValidEmail } from "../../utils/validate";
import { Role } from "@prisma/client";

// Extend Express Request interface to include 'files' (fix: use 'export' for module augmentation)
export {};
declare global {
  namespace Express {
    interface Request {
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[]
        | undefined;
    }
  }
}

const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      organization,
      legalName,
      registrationNumber,
      country,
      website,
      contactPersonTitle,
      organizationType,
    } = req.body;

    // File uploads (if any) - now handled by Cloudinary, not Multer
    const files = req.files as Record<string, any> | undefined;
    let businessRegistrationDocUrl = null;
    let taxIdDocUrl = null;
    let proofOfAddressDocUrl = null;

    // Cloudinary upload logic (buffer)
    const {
      uploadToCloudinaryBuffer,
    } = require("../../utils/uploadToCloudinary");
    if (files?.businessRegistrationDoc?.[0]?.buffer) {
      const uploadRes = await uploadToCloudinaryBuffer(
        files.businessRegistrationDoc[0].buffer,
        "foodshare/recipients",
        files.businessRegistrationDoc[0].originalname
      );
      businessRegistrationDocUrl = uploadRes.url;
    }
    if (files?.taxIdDoc?.[0]?.buffer) {
      const uploadRes = await uploadToCloudinaryBuffer(
        files.taxIdDoc[0].buffer,
        "foodshare/recipients",
        files.taxIdDoc[0].originalname
      );
      taxIdDocUrl = uploadRes.url;
    }
    if (files?.proofOfAddressDoc?.[0]?.buffer) {
      const uploadRes = await uploadToCloudinaryBuffer(
        files.proofOfAddressDoc[0].buffer,
        "foodshare/recipients",
        files.proofOfAddressDoc[0].originalname
      );
      proofOfAddressDocUrl = uploadRes.url;
    }

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

    // Call authService and include all org fields and docs (Cloudinary URLs)
    const result = await authService.register(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      role,
      organization,
      legalName,
      registrationNumber,
      country,
      website,
      contactPersonTitle,
      organizationType,
      businessRegistrationDocUrl,
      taxIdDocUrl,
      proofOfAddressDocUrl
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
    const { token } = req.body;
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
    const { email, password, role, firstName, lastName, phoneNumber } =
      req.body;

    if (!email || !password || !role) {
      throw new CustomError("You should fill all fields", 400);
    }

    const success = await authService.login(
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber
    );

    // If requireSubscription is present, send it in the response
    if (success.requireSubscription) {
      res.status(200).json({
        requireSubscription: true,
        user: success.user,
      });
      return;
    }

    res.status(200).json({
      user: {
        id: success.user.id,
        email: success.user.email,
        firstName: success.user.firstName,
        lastName: success.user.lastName,
        phoneNumber: success.user.phoneNumber,
        role: success.user.role,
      },
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
