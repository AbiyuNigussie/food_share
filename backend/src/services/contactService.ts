import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/email";

const prisma = new PrismaClient();

const submitMessage = async (
  name: string,
  email: string,
  phoneNumber: string,
  subject: string,
  message: string
) => {
  return await prisma.contactMessage.create({
    data: { name, email, phoneNumber, subject, message },
  });
};

const addAdminResponse = async (
  contactMessageId: string,
  message: string,
  adminId: string
) => {
  console.log("from service", contactMessageId, message, adminId);
  const contactMessage = await prisma.contactMessage.findUnique({
    where: { id: contactMessageId },
    include: { response: true }, // Check if a response already exists
  });

  if (!contactMessage) {
    throw new Error("ContactMessage not found");
  }

  if (contactMessage.response) {
    throw new Error("A response already exists for this ContactMessage");
  }

  // Create the AdminResponse and link it to the ContactMessage
  const response = await prisma.adminResponse.create({
    data: {
      message,
      adminId,
      contactMessageId,
    },
  });

  await prisma.contactMessage.update({
    where: { id: contactMessageId },
    data: {
      status: "Replied",
    },
  });

  // Send an email notification
  const emailSubject = "Your Contact Message Received a Response!";
  const emailBody = `Dear user,\n\nAn admin has responded to your message:\n\n"${response.message}"\n\nThank you for reaching out!`;

  await sendEmail({
    to: contactMessage.email,
    subject: emailSubject,
    text: emailBody,
  });

  return response;
};

const updateAdminResponse = async (
  responseId: string,
  newMessage: string,
  adminId: string
) => {
  const existingResponse = await prisma.adminResponse.findUnique({
    where: { id: responseId },
    include: { contactMessage: true },
  });

  if (!existingResponse) {
    throw new Error("Response not found");
  }

  if (!existingResponse.contactMessage) {
    throw new Error("Associated ContactMessage not found");
  }

  // Update the response message
  const updatedResponse = await prisma.adminResponse.update({
    where: { id: responseId },
    data: {
      message: newMessage,
      adminId,
    },
  });

  // Send an email notification
  const emailSubject = "Your Contact Message Has Been Updated!";
  const emailBody = `Dear user,\n\nAn admin has updated their response to your inquiry:\n\n"${newMessage}"\n\nThank you for reaching out!`;

  await sendEmail({
    to: existingResponse.contactMessage.email,
    subject: emailSubject,
    text: emailBody,
  });

  return updatedResponse;
};

const getMessagesWithResponses = async () => {
  return await prisma.contactMessage.findMany({
    include: {
      response: {
        include: {
          Admin: {
            select: {
              userId: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

const deleteMessage = async (messageId: string) => {
  return await prisma.contactMessage.delete({
    where: { id: messageId },
  });
};

export {
  submitMessage,
  addAdminResponse,
  updateAdminResponse,
  getMessagesWithResponses,
  deleteMessage,
};
