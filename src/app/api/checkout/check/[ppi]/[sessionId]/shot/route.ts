import db from "@/core/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { ppi: string; sessionId: string } }
) {
  const sessionId = params.sessionId;
  const ppi = params.ppi;

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
    return NextResponse.json(
      { success: false, error: "payment_already_processed" },
      { status: 400 }
    );
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

    return NextResponse.json(
      {
        success: true,
        credits: project.credits,
        promptWizardCredits: project.promptWizardCredits,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      success: false,
    },
    { status: 400 }
  );
}
