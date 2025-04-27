import { Request, Response } from 'express'
const  authService = require('../../services/user/authService') ;
import { CustomError } from '../../utils/CustomError';
import {isValidEmail} from '../../utils/validate'
import { Role } from '@prisma/client';
const register = async (req:Request, res:Response) => {
    try {
        const { firstName, lastName , email, phoneNumber, password, role } = req.body
        
         if(!firstName || !lastName || !email || !phoneNumber || !password || !role) {
            const error = new CustomError("You should fill all fields ", 400)
            throw error
         }

         if (!['DONOR', 'RECIPIENT', 'LOGISTIC_PROVIDER'].includes(role)) {
          throw new CustomError("Invalid role specified", 400);
        }

         if(password.length < 6 ) {
          const error = new CustomError("The password should not be less that 6", 400)
          throw error
         }         
         const testEmail = isValidEmail(email)

         if(!testEmail) {
          const error = new CustomError("The email is not valid", 400)
          throw error
         }
        
        const result = await authService.register(firstName, lastName, email, phoneNumber, password, role);

        res.status(201).json({
            message: "User registered successfully!",
            token: result.token
        })

    } catch (error) {
         
    if (error instanceof CustomError) {
       
        res.status(error.status || 500).json({ message: error.message });
      } else if (error instanceof Error) {
         
        res.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
    
        res.status(500).json({ message: 'Unknown error occurred' });
      }
    }
 };
 const verifyEmail = async (req:Request, res:Response) => {
  try {
    const { token } = req.query;

    const user = await authService.verifyEmail(token)

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    
  } catch (error:any) {
    res.status(error.status || 500).json({ message: error.message || 'internal server error' });
  }

}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      throw new CustomError("You should fill all fields", 400);
    }

    const success = await authService.login(email, password);

    res.status(200).json({
      token: success.token
    });

  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.status || 500).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};

 export { register, verifyEmail, login }