// src/config/nodemailer.ts
import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

// Define interface for SMTP configuration
interface MailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {  // Fixed: Use object type instead of array
        user: string;
        pass: string;
    };
}

// Create transporter with proper type
const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {  // Fixed: Use object literal syntax
        user: process.env.SMTP_USER!,  // Fixed: Removed typo (SMTP_USER1 → SMTP_USER)
        pass: process.env.SMTP_PASSWORD!
    }
} as MailConfig);

// Verify connection on startup
transporter.verify((error) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send messages');
    }
});

export default transporter;