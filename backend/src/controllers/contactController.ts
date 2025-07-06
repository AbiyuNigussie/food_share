import { Request, Response } from "express";
import {
  submitMessage,
  addAdminResponse,
  getMessagesWithResponses,
  deleteMessage,
  updateAdminResponse,
} from "../services/contactService";
import { AuthenticatedRequest } from "../types";

const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, subject, message } = req.body;
    const newMessage = await submitMessage(
      name,
      email,
      phoneNumber,
      subject,
      message
    );
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error submitting message." });
  }
};

const respondToMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contactMessageId, response } = req.body;
    const adminId = req.user?.id;
    if (!adminId) {
      res.status(400).json({ error: "Admin ID is required." });
      return;
    }
    const adminResponse = await addAdminResponse(
      contactMessageId,
      response,
      adminId
    );
    res.status(201).json(adminResponse);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Error adding response." });
  }
};

const updateResponse = async (req: Request, res: Response) => {
  try {
    const { responseId } = req.params; // Get response ID from URL
    const { message } = req.body;
    const adminId = (req as any).admin.id;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const updatedResponse = await updateAdminResponse(
      responseId,
      message,
      adminId
    );

    res
      .status(200)
      .json({ message: "Response updated successfully", updatedResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const fetchMessagesWithResponses = async (req: Request, res: Response) => {
  try {
    const messages = await getMessagesWithResponses();
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching messages." });
  }
};

const removeMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    await deleteMessage(messageId);
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting message." });
  }
};

export {
  submitContactMessage,
  respondToMessage,
  updateResponse,
  fetchMessagesWithResponses,
  removeMessage,
};
