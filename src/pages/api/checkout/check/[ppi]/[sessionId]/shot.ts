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

  const payments = await db.payment.findMany({
    where: {
      stripeSessionId: sessionId,
      projectId: ppi,
      status: "paid",
      type: "credits",
    },
  });

  if (payments.length > 0) {
    return res
      .status(400)
      .json({ success: false, error: "payment_already_processed" });
  }

  if (
    session.payment_status === "paid" &&
    session.metadata?.projectId === ppi
  ) {
    const quantity = Number(session.metadata?.quantity);
    const promptWizardQuantity = Number(session.metadata?.promptWizardQuantity);

    const project = await db.project.update({
      where: { id: ppi },
      data: {
        credits: { increment: quantity },
        promptWizardCredits: { increment: promptWizardQuantity },
      },
    });

    await db.payment.create({
      data: {
        status: "paid",
        projectId: ppi,
        type: "credits",
        stripeSessionId: sessionId,
      },
    });

    return res.status(200).json({
      success: true,
      credits: project.credits,
      promptWizardCredits: project.promptWizardCredits,
    });
  }

  return res.status(400).json({ success: false });
}
