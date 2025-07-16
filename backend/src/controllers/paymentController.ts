import Stripe from "stripe";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Optional: Check if payment was successful
    if (session.payment_status !== "paid") {
      res.status(400).json({ error: "Payment not completed" });
      return;
    }

    // Extract metadata
    const { plan, email } = session.metadata || {};

    if (!email || !plan) {
      res.status(400).json({ error: "Missing payment metadata" });
      return;
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { recipient: true },
    });

    if (!user || user.role !== "RECIPIENT" || !user.recipient) {
      res.status(404).json({ error: "Recipient user not found" });
      return;
    }

    // Update recipient subscription status and date
    await prisma.recipient.update({
      where: { userId: user.id },
      data: {
        subscriptionStatus: "active",
        subscriptionDate: new Date(),
      },
    });

    // You can also log the subscription plan, save payment info, etc.

    res.json({ message: "Subscription activated successfully" });
  } catch (error) {
    console.error("Payment success processing error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
