// src/utils/sendEmail.ts
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

const sendEmail = async ({
  to,
  subject,
  html,
  text,
  attachments,
}: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions: any = {
    from: `"Food Share" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    ...(html && { html }),
    ...(text && { text }),
    ...(html && !text && { text: html.replace(/<\/?[^>]+(>|$)/g, "") }),
    ...(attachments && { attachments }),
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
