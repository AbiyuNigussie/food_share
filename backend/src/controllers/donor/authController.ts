import { Request, Response } from 'express'
const  authService = require('../../services/donor/authService') ;
import { CustomError } from '../../utils/CustomError';
import {isValidEmail} from '../../utils/validate'
const register = async (req:Request, res:Response) => {
    try {
        const { firstName, lastName , email, phoneNumber, password } = req.body
        
         if(!firstName || !lastName || !email || !phoneNumber || !password) {
            const error = new CustomError("You should fill all fields ", 400)
            throw error
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
        
        const result = await authService.register(firstName, lastName, email, phoneNumber, password);
       

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
 }


 export { register }