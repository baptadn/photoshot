import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import db from "@/core/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionId = req.query.sessionId as string;
  const ppi = req.query.ppi as string;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (
    session.payment_status === "paid" &&
    session.metadata?.projectId === ppi
  ) {
    await db.project.update({
      where: { id: ppi },
      data: { stripePaymentId: session.id },
    });

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false });
}
