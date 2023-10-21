import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ppi = url.searchParams.get("ppi");

  try {
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      metadata: {
        projectId: ppi as string,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(process.env.NEXT_PUBLIC_STRIPE_STUDIO_PRICE),
            product_data: {
              name: `Studio model training + ${process.env.NEXT_PUBLIC_STUDIO_SHOT_AMOUNT} shots`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&ppi=${ppi}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err: any) {
    return NextResponse.json(err.message, { status: 400 });
  }
}
