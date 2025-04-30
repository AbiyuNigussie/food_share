import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another provider like SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Food Share" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    // send both if available, fallback to one
    ...(html && { html }),
    ...(text && { text }),
    ...(html && !text && { text: html.replace(/<\/?[^>]+(>|$)/g, "") }), // generate plain text from HTML if text not provided
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
