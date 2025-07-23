import Stripe from "stripe";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/email";
import { generateReceiptPDF } from "../services/pdfGenerator";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const prisma = new PrismaClient();
export const handleInitialize = async (req: Request, res: Response) => {
  const {
    amount,
    currency = "USD",
    email,
    first_name,
    last_name,
    plan,
    success_url,
    cancel_url,
  } = req.body;

  if (!email || !first_name || !last_name || !plan || !amount) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  try {
    const amountInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `FoodShare Subscription - ${plan}`,
              description: `Subscription for ${plan} plan by ${first_name} ${last_name}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      mode: "payment",
      success_url:
        success_url ||
        `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || process.env.CLIENT_URL,
      metadata: {
        plan,
        email,
        full_name: `${first_name} ${last_name}`,
        // You can also store any internal ref or token if needed
      },
    });

    res.json({ checkout_url: session.url });
  } catch (error) {
    console.error("Stripe payment initialization failed:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

export const handlePaymentSuccess = async (req: Request, res: Response) => {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    res.status(400).json({ error: "Missing or invalid session_id" });
    return;
  }

  try {
    // Retrieve session with line items expanded
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"]
    });

    if (session.payment_status !== "paid") {
      res.status(400).json({ error: "Payment not completed" });
      return;
    }

    const { plan, email, full_name } = session.metadata || {};
    if (!email || !plan || !full_name) {
      res.status(400).json({ error: "Missing payment metadata" });
      return;
    }

    // Find user and update recipient
    const user = await prisma.user.findUnique({
      where: { email },
      include: { recipient: true },
    });

    if (!user || user.role !== "RECIPIENT" || !user.recipient) {
      res.status(404).json({ error: "Recipient user not found" });
      return;
    }

    await prisma.recipient.update({
      where: { userId: user.id },
      data: {
        subscriptionStatus: "active",
        subscriptionDate: new Date(),
      },
    });

    // Generate and send receipt
    const paymentDate = new Date(session.created * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const amountTotal = (session.amount_total || 0) / 100;
    const currency = session.currency?.toUpperCase() || "USD";
    
    const receiptData = {
      full_name: `${full_name}`, 
      plan: plan,
      amount: amountTotal.toFixed(2),
      currency: currency,
      date: paymentDate,
      transaction_id: session.id,
      year: new Date().getFullYear().toString()
    };

    // Generate PDF receipt
    const pdfBuffer = await generateReceiptPDF(receiptData);
    
    // Send email with receipt
    const emailHtml = `
      <p>Hello ${full_name},</p>
      <p>Thank you for subscribing to the ${plan} plan!</p>
      <p>Your payment of ${amountTotal.toFixed(2)} ${currency} was successful.</p>
      <p>Find your receipt attached to this email.</p>
      <p>Best regards,<br/>FoodShare Team</p>
    `;
    
    await sendEmail({
      to: email,
      subject: `Your FoodShare ${plan} Plan Receipt`,
      html: emailHtml,
      attachments: [{
        filename: `FoodShare_Receipt_${session.id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    });

    res.json({ message: "Subscription activated and receipt sent" });
    
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
