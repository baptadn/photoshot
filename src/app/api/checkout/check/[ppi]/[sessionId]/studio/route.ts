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

  if (
    session.payment_status === "paid" &&
    session.metadata?.projectId === ppi
  ) {
    await db.project.update({
      where: { id: ppi },
      data: { stripePaymentId: session.id },
    });

    return NextResponse.json(
      {
        success: true,
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
