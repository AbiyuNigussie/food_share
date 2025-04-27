import { Request, Response } from 'express';
import { CustomError } from '../../utils/CustomError';
import * as authService from '../../services/admin/authservice';

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, secretKey } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password || !secretKey) {
      throw new CustomError('All fields including secretKey are required', 400);
    }

    const result = await authService.register(firstName, lastName, email, phoneNumber, password, secretKey);

    res.status(201).json({
      message: 'Admin registered successfully!',
      token: result.token
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.status || 500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError('Email and password are required', 400);
    }

    const result = await authService.login(email, password);

    res.status(200).json({ token: result.token });
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.status || 500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

export { register, login };
